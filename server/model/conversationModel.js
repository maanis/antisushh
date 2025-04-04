const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'message',
    }]
}, { timestamps: true })

const conversationModel = mongoose.model('Conversation', conversationSchema);

module.exports = conversationModel;