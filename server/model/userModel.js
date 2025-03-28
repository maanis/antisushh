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
    email: { type: String, default: '' },
    profileTitle: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    pfp: { type: String, default: '' },
    coverPhoto: { type: String, default: '' },
    bio: { type: String, default: '' },
    pals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    recieveRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }],
    hasCompleteProfile: { type: Boolean, default: false }
})

const userModel = mongoose.model('user', userScheme);

module.exports = userModel;