const { io } = require('../socket/socket.io');
const conversationModel = require('../model/conversationModel');
const messageModel = require('../model/messageModel');
const { userSocketId } = require('../socket/socket.io');


const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const recieverId = req.params.id;
        const { message } = req.body;

        if (!message) return res.status(401).json({ message: 'Message is required' });
        if (!senderId || !recieverId) return res.status(401).json({ message: 'No user found' });

        let conversation = await conversationModel.findOne({
            members: { $all: [senderId, recieverId] }
        });

        if (!conversation) {
            conversation = await conversationModel.create({
                members: [senderId, recieverId]
            });
        }

        let msg = await messageModel.create({
            senderId,
            recieverId,
            message
        });

        conversation.messages.push(msg._id);
        await conversation.save();  // Ensure this is awaited

        const recieverSocketId = userSocketId(recieverId)
        if (recieverSocketId) {
            io?.to(recieverSocketId).emit('newMsg', msg);
        }

        res.status(200).json({ success: true, message: 'Message sent successfully', msg });
    } catch (error) {
        console.log(error); // Add logging for debugging
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getMessages = async (req, res) => {
    try {
        const senderId = req.id;
        const recieverId = req.params.id;
        if (!senderId || !recieverId) return res.status(401).json({ message: 'No user found' });
        let conversation = await conversationModel.findOne({
            members: { $all: [senderId, recieverId] }
        }).populate('messages')

        if (!conversation) return res.status(200).json({ success: true, messages: [] });
        res.status(200).json({ success: true, messages: conversation.messages });
        // res.send('running')

    } catch (error) {
        console.log(error); // Add logging for debugging
        res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.id;

        const message = await messageModel.findById(messageId);
        if (!message) return res.status(404).json({ message: 'Message not found' });
        if (message.senderId.toString() !== userId) return res.status(403).json({ message: 'Unauthorized' });

        await messageModel.findByIdAndDelete(messageId);

        res.status(200).json({ success: true, message: 'Message deleted successfully' });
    } catch (error) {
        console.log(error); 
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { sendMessage, getMessages, deleteMessage };
