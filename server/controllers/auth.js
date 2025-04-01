const userModel = require("../model/userModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const postModel = require("../model/postModel");
const notificationModel = require('../model/notificationModel');

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
        const user = await userModel.findById(exist._id).select('-password');
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
        const senderId = req.id
        const { recieverId } = req.body
        console.log(recieverId)
        if (senderId === recieverId) return res.status(400).json({ message: "You can't send a request to yourself" });
        const sender = await userModel.findById(senderId);
        const receiver = await userModel.findById(recieverId);
        if (!sender || !receiver) return res.status(404).json({ message: 'User not found' });
        if (receiver.recieveRequests.includes(senderId) || sender.sentRequests.includes(recieverId)) {
            const index1 = receiver.recieveRequests.indexOf(senderId);
            const index2 = sender.sentRequests.indexOf(recieverId);
            if (index1 !== -1) {
                receiver.recieveRequests.splice(index1, 1); // Remove senderId from receiver's requests
            }
            if (index2 !== -1) {
                sender.sentRequests.splice(index2, 1);
            }
            await sender.save();
            await receiver.save();
            return res.status(200).json({ success: true, message: 'Request removed' });

        } else {
            sender.sentRequests.push(recieverId);
            receiver.recieveRequests.push(senderId);
            await sender.save();
            await receiver.save();
            return res.status(200).json({ success: true, message: 'Request sent' });
        }




        res.status(200).json({ message: 'Friend request sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}

const declineRequest = async (req, res) => {
    try {
        const senderId = req.id
        const recieverId = req.params.id
        if (senderId === recieverId) return res.status(400).json({ message: "You can't send a request to yourself" });
        const sender = await User.findById(senderId);
        const receiver = await User.findById(recieverId);
        if (!sender || !receiver) return res.status(404).json({ message: 'User not found' });

        receiver.receivedRequests = receiver.receivedRequests.filter(id => id.toString() !== senderId);
        sender.sentRequests = sender.sentRequests.filter(id => id.toString() !== recieverId);

        await sender.save();
        await receiver.save();

        res.status(200).json({ message: 'Friend request declined' });
    } catch (error) {
        res.strecieverIdatus(500).json({ message: 'Internal server error', success: false });
    }
}

const acceptRequest = async (req, res) => {
    const senderId = req.id
    const recieverId = req.params.id
    if (senderId === recieverId) return res.status(400).json({ message: "You can't send a request to yourself" });
    const sender = await User.findById(senderId);
    const receiver = await User.findById(recieverId);
    if (!sender || !receiver) return res.status(404).json({ message: 'User not found' });
    if (!receiver.receivedRequests.includes(senderId)) {
        return res.status(400).json({ message: 'No friend request found' });
    }

    receiver.friends.push(senderId);
    sender.friends.push(recieverId);

    receiver.receivedRequests = receiver.receivedRequests.filter(id => id.toString() !== senderId);
    sender.sentRequests = sender.sentRequests.filter(id => id.toString() !== recieverId);

    await sender.save();
    await receiver.save();

    res.status(200).json({ message: 'Friend request accepted' });
}

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
        const id = req.id
        const currentUser = await userModel.findById(id)
        const { name, username, email, profileTitle, bio } = req.body;
        if (req.file) {
            const image = req.file.buffer.toString('base64');
            await userModel.findByIdAndUpdate(req.id, { pfp: image })
        }
        if (username != currentUser.username) {
            const exist = await userModel.findOne({ username })
            if (exist) {
                res.status(402).json({ success: false, message: 'User already exist with this username' });
                return
            }
        }
        await userModel.findByIdAndUpdate(req.id, { name, username, email, profileTitle, bio })
        const user = await userModel.findById(req.id).select('-password');
        res.status(200).json({ user, success: true, message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}

const updateProfile = async (req, res) => {
    try {
        const { profileTitle, bio, email, githubUrl, linkedinUrl } = req.body
        if (req.file) {
            const img = req.file.buffer.toString('base64');
            const base64Image = img ? `data:image/jpeg;base64,${img}` : null;
            await userModel.findByIdAndUpdate(req.id, { pfp: base64Image })
        }
        await userModel.findByIdAndUpdate(req.id, { profileTitle, bio, email, githubUrl, linkedinUrl, hasCompleteProfile: true })
        const user = await userModel.findById(req.id).select('-password');
        res.status(200).json({ user, message: 'Profile upadated successfully', success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error hai', success: false });
    }

}

const updatePfp = async (req, res) => {
    try {
        let base64Image = null;
        if (req.file === undefined) {
            base64Image = "";
        } else {
            base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        }
        await userModel.findByIdAndUpdate(req.id, { pfp: base64Image });
        const user = await userModel.findById(req.id);
        return res.status(200).json({ user, message: 'Profile picture updated successfully', success: true });
    } catch (error) {
        console.error("Error updating profile picture:", error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};


const updatecoverPhoto = async (req, res) => {
    try {
        console.log(req.file)
        if (!req.file) return res.status(400).json({ message: 'file required', success: false });
        const img = req.file.buffer.toString('base64');
        const base64Image = img ? `data:image/jpeg;base64,${img}` : null;
        await userModel.findByIdAndUpdate(req.id, { coverPhoto: base64Image })
        const user = await userModel.findById(req.id)
        res.status(200).json({ user, message: 'Pfp upadated successfully', success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error hai', success: false });
    }
}

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
        const user = await userModel.findOne({ username }).select('-password -email -sentRequests -recieveRequests -friends -bookmarks -posts -coverPhoto')
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


module.exports = { register, updateProfile, getNotifications, markNotificationsAsRead, getUser, login, logout, searchQuerry, userProfile, sendOrRemoveRequest, acceptRequest, declineRequest, suggestedUser, editProfile, updatecoverPhoto, updatePfp };