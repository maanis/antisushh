const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        text: { type: String, required: true }
    },
    { timestamps: true } // This enables createdAt and updatedAt fields for comments
);


const postSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        caption: { type: String, required: true },
        image: { type: String, required: true },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
        comments: [commentSchema] // Use the separate comment schema
    },
    { timestamps: true } // This enables timestamps for posts
);



const postModel = mongoose.model('post', postSchema);

module.exports = postModel;