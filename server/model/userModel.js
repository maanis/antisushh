const mongoose = require('mongoose');

const userScheme = mongoose.Schema({
    name: String,
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: { type: String, default: '' },
    bio: { type: String, default: '' },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }],

})

const userModel = mongoose.model('user', userScheme);

module.exports = userModel;