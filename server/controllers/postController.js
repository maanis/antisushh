const postModel = require('../model/postModel');
const userModel = require('../model/userModel');
const { isValidObjectId } = require('mongoose');
const createNotification = require('../utils/createNotification');
const notificationModel = require('../model/notificationModel');
const { io, userSocketId } = require('../socket/socket.io');
const uploadToCloudinary = require('../utils/cloudinaryUload');

const createPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const userId = req.id;

        if (!caption) {
            return res.status(400).json({ message: 'Please fill all the fields', success: false });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image', success: false });
        }

        console.log("Received file size:", req.file.size / 1024 / 1024, "MB");


        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ message: 'Only image files are allowed', success: false });
        }

        const result = await uploadToCloudinary(req.file.buffer, {
            resource_type: 'image',
            folder: 'antisush/posts'
        });

        const optimizedUrl = result.secure_url.replace('/upload/', '/upload/w_600,q_auto,f_auto/');

        const post = await postModel.create({
            caption,
            image: optimizedUrl,
            user: userId
        });

        const user = await userModel.findById(userId);
        user.posts.push(post._id);
        await user.save();

        const newPost = await post.populate('user', 'username pfp');
        res.status(200).json({ newPost, message: 'Post created', success: true });

    } catch (error) {
        console.error('Cloudinary upload error:', error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};




const getAllPosts = async (req, res) => {
    try {
        const allPosts = await postModel.find().populate('user', 'username pfp').populate('comments.user', 'username pfp')
        res.status(200).json({ posts: allPosts, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}

const getUserPosts = async (req, res) => {
    try {
        const userId = req.id
        const user = await userModel.findById(userId).select('-password -bookmarks')
        if (!user) return res.status(401).json({ message: 'Something is incorrect', success: false })
        const posts = await user.populate('posts')
        res.status(200).json({ user: posts, message: 'All posts', success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}

const likeOrDislike = async (req, res) => {
    try {
        const userId = req.id
        const postId = req.params.id
        if (!isValidObjectId(postId)) {
            return res.status(400).json({ message: "Invalid Post ID", success: false });
        }
        if (!userId) return res.status(401).json({ message: 'Something is incorrect', success: false })
        const post = await postModel.findById(postId).populate('user', 'username pfp _id')
        if (post.likes.includes(userId)) {
            //dislike
            await postModel.findByIdAndUpdate(postId, { $pull: { likes: userId } })
            const notificationToDelete = await notificationModel.findOne({
                type: 'like',
                sender: userId,
                receiver: post.user._id,
                post: postId
            });

            if (notificationToDelete) {
                await notificationModel.deleteOne({ _id: notificationToDelete._id });

                const receiverSocketId = userSocketId(post.user._id.toString());
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('deleteNotifications', notificationToDelete._id);
                }
            }

            res.status(200).json({ message: 'disliked', success: true });
        } else {
            //like
            post.likes.push(userId)
            await post.save()
            await createNotification('like', userId, post.user._id, postId);
            res.status(200).json({ message: 'liked', success: true });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}

const addComments = async (req, res) => {
    try {
        const userId = req.id
        const postId = req.params.id
        if (!isValidObjectId(postId)) {
            return res.status(400).json({ message: "Invalid Post ID", success: false });
        }
        const { commentText } = req.body
        if (!commentText) return res.status(401).json({ message: 'Comment is required', success: false })
        if (!userId || !postId) return res.status(401).json({ message: 'No user found', success: false })
        const user = await userModel.findById(userId).select('username pfp')
        const post = await postModel.findById(postId).populate('user', 'username pfp _id')
        if (!post) return res.status(401).json({ message: 'post not found', success: false })
        post.comments.push({ user: userId, text: commentText })
        createNotification('comment', userId, post.user._id, postId);
        await post.save()

        res.status(200).json({ commentText, user, message: 'Comment posted', success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}

const deletePost = async (req, res) => {
    try {
        const userId = req.id
        const postId = req.params.id
        if (!isValidObjectId(postId)) {
            return res.status(400).json({ message: "Invalid Post ID", success: false });
        }
        const post = await postModel.findById(postId)
        if (!post) return res.status(401).json({ message: 'No post found', success: false })
        if (post.user.toString() === userId.toString()) {
            await postModel.findByIdAndDelete(postId)
            await userModel.findByIdAndUpdate(userId, { $pull: { posts: postId } })
            return res.status(200).json({ message: 'Post Deleted', success: true });
        } else {
            res.status(500).json({ message: 'You cant delete', success: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}


const addOrRemoveToBookmark = async (req, res) => {
    try {
        const userId = req.id
        const postId = req.params.id
        if (!userId || !postId) return res.status(401).json({ message: 'Something is incorrect', success: false })
        const user = await userModel.findById(userId)
        if (!user) return res.status(401).json({ message: 'No user found', success: false })
        if (user.bookmarks.includes(postId)) {
            //remove
            await userModel.findByIdAndUpdate(userId, { $pull: { bookmarks: postId } })
            res.status(200).json({ message: 'removed from bookmark', success: true });
        } else {
            //add
            await userModel.findByIdAndUpdate(userId, { $push: { bookmarks: postId } })
            res.status(200).json({ message: 'added to bookmark', success: true });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}

const getBookmarks = async (req, res) => {
    try {
        const userId = req.id
        if (!userId) return res.status(401).json({ message: 'Something is incorrect', success: false })
        const user = await userModel.findById(userId)
        if (!user) return res.status(401).json({ message: 'No user found', success: false })
        const userBookmark = await user.populate({
            path: 'bookmarks',
            populate: { path: 'user' } // This will populate the 'user' field inside each bookmark
        });
        res.status(200).json({ bookmarks: userBookmark.bookmarks, message: 'retrieved bookmarks', success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}

module.exports = { createPost, getAllPosts, getUserPosts, likeOrDislike, addComments, deletePost, addOrRemoveToBookmark, getBookmarks }
