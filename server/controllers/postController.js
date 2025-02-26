const postModel = require('../model/postModel');
const userModel = require('../model/userModel');

const createPost = async (req, res) => {
    try {
        const { caption } = req.body;
        let userId = req.id;
        if (!caption) return res.status(400).json({ message: 'Please fill all the fields', success: false });
        if (req.file) {
            const post = await postModel.create({
                caption,
                image: req.file.buffer.toString('base64'),
                user: userId
            })
            const user = await userModel.findById(userId);
            user.posts.push(post._id);
            await user.save();
            res.status(200).json({ message: 'Post created', success: true });
        } else {
            res.status(400).json({ message: 'Please upload an image', success: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }

}

const getAllPosts = async (req, res) => {
    try {
        const allPosts = await postModel.find().populate('user', 'username, pfp, _id')
        res.status(200).json({ posts: allPosts, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}

const getUserPosts = async (req, res) => {
    try {
        const userId = req.id
        const user = await userModel.findById(userId)
        if (!user) return res.status(401).json({ message: 'No user found', success: false })
        const posts = await user.populate('posts')
        res.status(200).json({ posts: posts, message: 'All posts', success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}

const likeOrDislike = async (req, res) => {
    const userId = req.id
    const postId = req.params.id
    if (!userId || postId) return res.status(401).json({ message: 'No user found', success: false })
    const post = await postModel.findById(postId)
    if (post.likes.includes(userId)) {
        //dislike
        await postModel.findByIdAndUpdate(postId, { $pull: { likes: userId } })
        res.status(200).json({ message: 'liked', success: true });
    } else {
        //like
        post.likes.push(userId)
        await post.save()
        res.status(200).json({ message: 'disliked', success: true });
    }
}

