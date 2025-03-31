const { io } = require('socket.io');
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
            io.to(recieverSocketId).emit('sendMessaga', msg);
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

module.exports = { sendMessage, getMessages };
