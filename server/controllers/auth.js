const userModel = require("../model/userModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
        res.status(200).json({ message: 'user signed up', success: true });
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

const followOrUnfollow = async (req, res) => {
    try {
        const currentUserId = req.id;
        const targetUserId = req.params.id;
        const currentUser = await userModel.findById(currentUserId);
        const targetUser = await userModel.findById(targetUserId);
        if (!targetUser) {
            res.status(404).json({ message: 'User not found', success: false });
            return;
        }
        if (currentUserId === targetUserId) {
            res.status(400).json({ message: 'You can not follow yourself', success: false });
            return;
        }
        const isFollowing = currentUser.following.includes(targetUserId);
        if (isFollowing) {
            await userModel.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } });
            await userModel.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } });
            res.status(200).json({ message: 'Unfollowed', success: true });
        }
        else {
            await userModel.findByIdAndUpdate(currentUserId, { $push: { following: targetUserId } });
            await userModel.findByIdAndUpdate(targetUserId, { $push: { followers: currentUserId } });
            res.status(200).json({ message: 'Followed', success: true });
        }

    } catch (error) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
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
        const { name, bio } = req.body;
        if (req.file) {
            const image = req.file.buffer.toString('base64');
            await userModel.findByIdAndUpdate(req.id, { pfp: image })
        }
        await userModel.findByIdAndUpdate(req.id, { name, bio })
        const user = await userModel.findById(req.id).select('-password');
        res.status(200).json({ user, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}

module.exports = { register, login, logout, followOrUnfollow, suggestedUser, editProfile };