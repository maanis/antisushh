const userModel = require("../model/userModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const postModel = require("../model/postModel");
const notificationModel = require('../model/notificationModel');
const { userSocketId, io } = require("../socket/socket.io");
const messageModel = require("../model/messageModel");
const uploadToCloudinary = require("../utils/cloudinaryUload");

const register = async function (req, res) {
    const { name, username, password } = req.body;
    try {
        if (!name || !username || !password) {
            res.status(400).json({ message: 'Please fill all the fields', success: false });
            return;
        }
        const exist = await userModel.findOne({ username });

        if (exist) {
            res.status(400).json({ message: 'user already exist', success: false });
            return;
        }
        const hassPass = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            name,
            username,
            password: hassPass
        });
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.cookie('token', token)
        res.status(200).json({ user, message: 'user signed up', success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}

const login = async function (req, res) {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            res.status(400).json({ message: 'Please fill all the fields', success: false });
            return;
        }
        const exist = await userModel.findOne({ username });

        if (!exist) {
            res.status(400).json({ message: 'User not exist', success: false });
            return;
        }
        const isMatch = await bcrypt.compare(password, exist.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Wrong credentials', success: false });
            return;
        }
        const user = await userModel.findById(exist._id).select('-password').populate('recieveRequests.user', 'username pfp');
        const token = jwt.sign({ userId: exist._id }, process.env.JWT_SECRET);
        res.cookie('token', token)
        res.status(200).json({ message: 'Signed in', success: true, user });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}

const logout = async function (req, res) {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out', success: true });
}


const sendOrRemoveRequest = async (req, res) => {
    try {
        const senderId = req.id;
        const { recieverId } = req.body;

        if (senderId === recieverId) {
            return res.status(400).json({ message: "You can't send a request to yourself" });
        }

        const sender = await userModel.findById(senderId);
        const receiver = await userModel.findById(recieverId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (sender.pals.includes(recieverId) || receiver.pals.includes(senderId)) {
            return res.status(400).json({ message: "You are already friends" });

        }


        const alreadySent = sender.sentRequests.some(request => request.user && request.user.toString() === recieverId.toString());
        const alreadyReceived = receiver.recieveRequests?.some(request => request.user && request.user.toString() === senderId.toString());

        // Debugging logs to verify if we found any requests

        if (alreadySent || alreadyReceived) {
            // If request is already sent or received, remove it
            if (alreadySent) {
                sender.sentRequests = sender.sentRequests.filter(request => request.user && request.user.toString() !== recieverId.toString());
                receiver.recieveRequests = receiver.recieveRequests.filter(request => request.user && request.user.toString() !== senderId.toString());
            }

            await sender.save();
            await receiver.save();

            const recieverSocketId = userSocketId(recieverId)
            if (recieverSocketId) {
                io.to(recieverSocketId).emit('removeReq', senderId)
            }

            return res.status(200).json({ success: true, message: 'Request removed', data: recieverId });
        } else {
            sender.sentRequests.unshift({ user: recieverId });
            receiver.recieveRequests.push({ user: senderId });

            await sender.save();
            await receiver.save();

            const populatedReciever = await userModel.findById(receiver._id).populate('recieveRequests.user', 'username pfp')

            const recieverSocketId = userSocketId(recieverId)
            if (recieverSocketId) {
                io.to(recieverSocketId).emit('sendReq', populatedReciever.recieveRequests[populatedReciever.recieveRequests.length - 1])
            }

            return res.status(200).json({ success: true, message: 'Request sent', data: sender.sentRequests[0] });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};





const declineRequest = async (req, res) => {
    try {
        const recieverId = req.id;
        const senderId = req.params.id;

        if (senderId === recieverId) {
            return res.status(400).json({ message: "You can't send a request to yourself" });
        }

        const sender = await userModel.findById(senderId);
        const receiver = await userModel.findById(recieverId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'User not found' });
        }

        receiver.recieveRequests = receiver.recieveRequests.filter(request => request.user.toString() !== senderId.toString());
        sender.sentRequests = sender.sentRequests.filter(request => request.user.toString() !== recieverId.toString());

        await sender.save();
        await receiver.save();

        const senderSocketId = userSocketId(senderId)
        if (senderSocketId) {
            io.to(senderSocketId).emit('declineReq', recieverId)
        }

        res.status(200).json({ success: true, message: 'Friend request declined', senderId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};


const acceptRequest = async (req, res) => {
    try {
        const recieverId = req.id;
        const senderId = req.params.id;
        if (senderId === recieverId) {
            return res.status(400).json({ message: "You can't send a request to yourself" });
        }
        const sender = await userModel.findById(senderId);
        const receiver = await userModel.findById(recieverId);
        console.log('running')
        if (!sender || !receiver) {
            return res.status(404).json({ message: 'User not found' });
        }
        const requestIndex = receiver.recieveRequests.findIndex(request => request.user.toString() === senderId.toString());
        if (requestIndex === -1) {
            return res.status(400).json({ message: 'No friend request found' });
        }
        receiver.pals.push(senderId);
        sender.pals.push(recieverId);
        receiver.recieveRequests.splice(requestIndex, 1);
        const senderRequestIndex = sender.sentRequests.findIndex(request => request.user.toString() === recieverId.toString());
        sender.sentRequests.splice(senderRequestIndex, 1);
        await sender.save();
        await receiver.save();
        const senderSocketId = userSocketId(senderId)
        if (senderSocketId) {
            io.to(senderSocketId).emit('acceptReq', recieverId)
        }
        res.status(200).json({ success: true, message: 'Friend request accepted', data: senderId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

const removePal = async (req, res) => {
    try {
        const currentUserId = req.id;
        const palId = req.params.id; // ID of the pal to be removed 
        if (currentUserId === palId) {
            return res.status(400).json({ message: "You can't remove yourself" });
        }
        const currentUser = await userModel.findById(currentUserId);
        const pal = await userModel.findById(palId);
        if (!currentUser || !pal) {
            return res.status(404).json({ message: 'User not found' });
        }
        currentUser.pals = currentUser.pals.filter(pal => pal.toString() !== palId.toString());
        pal.pals = pal.pals.filter(pal => pal.toString() !== currentUserId.toString());
        await currentUser.save();
        await pal.save();
        const palSocketId = userSocketId(palId)
        if (palSocketId) {
            io.to(palSocketId).emit('unPal', currentUserId)
        }
        res.status(200).json({ success: true, message: 'Unfriended successfully', data: palId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};


const suggestedUser = async (req, res) => {
    try {
        const suggestedUsers = await userModel.find({ _id: { $ne: req.id } }).select('-password').limit(5);
        res.status(200).json({ suggestedUsers, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}

const editProfile = async (req, res) => {
    try {
        const id = req.id;
        const currentUser = await userModel.findById(id);
        const { name, username, email, profileTitle, bio } = req.body;

        if (username && username !== currentUser.username) {
            const exist = await userModel.findOne({ username });
            if (exist) {
                return res.status(402).json({ success: false, message: 'User already exists with this username' });
            }
        }
        const update = { name, username, email, profileTitle, bio };
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, {
                resource_type: 'image',
                folder: 'antisush/pfps'
            });
            const optimizedUrl = result.secure_url.replace('/upload/', '/upload/w_600,q_auto,f_auto/');
            update.pfp = optimizedUrl;
        }
        await userModel.findByIdAndUpdate(id, update);
        const user = await userModel.findById(id).select('-password');

        res.status(200).json({ user, success: true, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error editing profile:', error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { profileTitle, bio, email, githubUrl, linkedinUrl } = req.body;
        let updateData = {
            profileTitle,
            bio,
            email,
            githubUrl,
            linkedinUrl,
            hasCompleteProfile: true
        };
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, {
                resource_type: 'image',
                folder: 'antisush/pfps'
            });
            const optimizedUrl = result.secure_url.replace('/upload/', '/upload/w_600,q_auto,f_auto/');
            updateData.pfp = optimizedUrl; // ✅ Store just the image URL
        }
        await userModel.findByIdAndUpdate(req.id, updateData);
        const user = await userModel.findById(req.id).select('-password');
        res.status(200).json({ user, message: 'Profile updated successfully', success: true });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Internal server error hai', success: false });
    }
};

const updatePfp = async (req, res) => {
    try {
        let update = {};
        if (!req.file) {
            update.pfp = "";
        } else {
            const result = await uploadToCloudinary(req.file.buffer, {
                resource_type: 'image',
                folder: 'antisush/pfps'
            });
            const optimizedUrl = result.secure_url.replace('/upload/', '/upload/w_600,q_auto,f_auto/');
            update.pfp = optimizedUrl;
        }
        await userModel.findByIdAndUpdate(req.id, update);
        const user = await userModel.findById(req.id).select('-password');
        return res.status(200).json({ user, message: 'Profile picture updated successfully', success: true });
    } catch (error) {
        console.error("Error updating profile picture:", error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};


const updatecoverPhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'File required', success: false });
        }
        const result = await uploadToCloudinary(req.file.buffer, {
            resource_type: 'image',
            folder: 'antisush/coverPhotos',
        });
        const optimizedUrl = result.secure_url.replace('/upload/', '/upload/w_1200,q_auto,f_auto/');
        await userModel.findByIdAndUpdate(req.id, { coverPhoto: optimizedUrl });
        const user = await userModel.findById(req.id);
        res.status(200).json({ user, message: 'Cover photo updated successfully', success: true });
    } catch (error) {
        console.error('Error uploading cover photo:', error);
        res.status(500).json({ message: 'Internal server error hai', success: false });
    }
};

const userProfile = async (req, res) => {
    try {
        const username = req.params.username
        const user = await userModel.findOne({ username })
            .populate({
                path: 'posts',
                populate: [
                    { path: 'user', select: 'name email username pfp' }, // Populate post author
                    { path: 'comments.user', select: 'name email username pfp' } // Populate users in comments
                ]
            })
            .populate({
                path: 'bookmarks',
                populate: [
                    { path: 'user', select: 'name email username pfp' }, // Populate bookmarked post author
                    { path: 'comments.user', select: 'name email username pfp' } // Populate users in comments of bookmarked posts
                ]
            });


        // const allPosts = await postModel.find({ user: user._id }).populate('user', 'username pfp').populate('comments.user', 'username pfp')

        if (!user) return res.status(400).json({ message: 'No user found with this username', success: false });
        res.status(200).json({ user, message: 'Found', success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}

const searchQuerry = async (req, res) => {
    try {
        const username = req.params.username
        const regex = new RegExp(username, 'i')
        const users = await userModel.find({ username: { $regex: regex }, _id: { $ne: req.id } })
        if (users.length === 0) return res.status(404).json({ users, message: 'no user found', success: false });
        res.status(200).json({ users, message: 'Found', success: true });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error', success: false });
    }

}

const getUser = async (req, res) => {
    try {
        const username = req.params.username
        const user = await userModel.findOne({ username }).select('-password -email -sentRequests -recieveRequests -pals -bookmarks -posts -coverPhoto')
        if (!user) return res.status(400).json({ message: 'No user found with this username', success: false });
        res.status(200).json({ user, message: 'Found', success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}

const getNotifications = async (req, res) => {
    try {
        const userId = req.id
        const notifications = await notificationModel.find({ receiver: userId }).populate('sender', 'username pfp').populate('post', 'image').sort({ createdAt: -1 });
        res.status(200).json({ notifications, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}

const markNotificationsAsRead = async (req, res) => {
    try {
        const { notificationIds } = req.body; // Array of notification IDs

        if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
            return res.status(400).json({ message: "No notifications provided", success: false });
        }

        await notificationModel.updateMany(
            { _id: { $in: notificationIds } },
            { $set: { isRead: true } }
        );

        res.status(200).json({ message: "Notifications marked as read", success: true });
    } catch (error) {
        console.error("Error updating notifications:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

const getLastMessages = async (req, res) => {
    try {
        const recieverId = req.id; // Logged-in user ID
        const { senderIds } = req.body; // Array of sender IDs from request body
        if (!Array.isArray(senderIds) || senderIds.length === 0) {
            return res.status(400).json({ error: "Invalid senderIds array" });
        }

        const lastMessages = await Promise.all(
            senderIds.map(async (senderId) => {
                const lastMsg = await messageModel.findOne({
                    $or: [
                        { senderId, recieverId },
                        { senderId: recieverId, recieverId: senderId }
                    ]
                })
                    .sort({ createdAt: -1 }) // Latest message
                    .select("senderId recieverId message createdAt")
                    .lean();

                return lastMsg ? {
                    senderId: lastMsg.senderId,
                    recieverId: lastMsg.recieverId,
                    msg: lastMsg.message,
                    time: lastMsg.createdAt
                } : null;
            })
        );

        const filteredMessages = lastMessages.filter(msg => msg !== null);

        return res.status(200).json({ success: true, messages: filteredMessages });
    } catch (error) {
        console.error("Error fetching last messages:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};



module.exports = { register, updateProfile, getLastMessages, removePal, getNotifications, markNotificationsAsRead, getUser, login, logout, searchQuerry, userProfile, sendOrRemoveRequest, acceptRequest, declineRequest, suggestedUser, editProfile, updatecoverPhoto, updatePfp };