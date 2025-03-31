const Notification = require('../model/notificationModel');
const { io, userSocketId } = require('../socket/socket.io');


const createNotification = async (type, senderId, receiverId, postId) => {
    if (senderId.toString() === receiverId.toString()) return;

    const notification = new Notification({
        type,
        sender: senderId,
        receiver: receiverId,
        post: postId,
    });

    await notification.save();

    const receiverSocketId = userSocketId(receiverId.toString());
    if (receiverSocketId) {
        io.to(receiverSocketId).emit('newNotification', notification);
    }
};

module.exports = createNotification;
