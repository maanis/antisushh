import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        type: { type: String, enum: ['like', 'comment'] },
        post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
        isRead: { type: Boolean, default: false }
    },
    { timestamps: true }
);

const notificationModel = mongoose.model('notification', notificationSchema);
module.exports = notificationModel;
