const mongoose = require('mongoose');

const userScheme = mongoose.Schema({
    name: { type: String, default: '' },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    pfp: { type: String, default: '' },
    bio: { type: String, default: '' },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }],
})

const userModel = mongoose.model('user', userScheme);

module.exports = userModel;