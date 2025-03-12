const userModel = require("../model/userModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const postModel = require("../model/postModel");

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


const sendRequest = async (req, res) => {
    try {
        const senderId = req.id
        const recieverId = req.params.id
        if (senderId === recieverId) return res.status(400).json({ message: "You can't send a request to yourself" });
        const sender = await User.findById(senderId);
        const receiver = await User.findById(recieverId);
        if (!sender || !receiver) return res.status(404).json({ message: 'User not found' });

        if (receiver.receivedRequests.includes(senderId) || sender.sentRequests.includes(recieverId)) {
            return res.status(400).json({ message: 'Request already sent' });
        }

        sender.sentRequests.push(recieverId);
        receiver.receivedRequests.push(senderId);

        await sender.save();
        await receiver.save();

        res.status(200).json({ message: 'Friend request sent successfully' });
    } catch (error) {
        res.strecieverIdatus(500).json({ message: 'Internal server error', success: false });
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
        const { name, username, email, profileTitle, bio } = req.body;
        if (req.file) {
            const image = req.file.buffer.toString('base64');
            await userModel.findByIdAndUpdate(req.id, { pfp: image })
        }
        await userModel.findByIdAndUpdate(req.id, { name, username, email, profileTitle, bio })
        const user = await userModel.findById(req.id).select('-password');
        res.status(200).json({ user, success: true });
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

const userProfile = async (req, res) => {
    try {
        const username = req.params.username
        const user = await userModel.findOne({ username })
            .populate({
                path: 'posts',
                populate: [
                    { path: 'user', select: 'name email' }, // Populate post author
                    { path: 'comments.user', select: 'name email' } // Populate users in comments
                ]
            })
            .populate({
                path: 'bookmarks',
                populate: [
                    { path: 'user', select: 'name email' }, // Populate bookmarked post author
                    { path: 'comments.user', select: 'name email' } // Populate users in comments of bookmarked posts
                ]
            });

        console.log(user);

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

module.exports = { register, updateProfile, login, logout, searchQuerry, userProfile, sendRequest, acceptRequest, declineRequest, suggestedUser, editProfile };