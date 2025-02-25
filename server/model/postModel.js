const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    caption: { type: String, required: true },
    image: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }]
})

const postModel = mongoose.model('post', postSchema);

module.exports = postModel;