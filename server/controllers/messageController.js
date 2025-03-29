export const sendMessage = async (req, res) => {
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

        res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.log(error); // Add logging for debugging
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getMessages = async (req, res) => {
    try {
        const senderId = req.id;
        const recieverId = req.params.id;
        if (!senderId || !recieverId) return res.status(401).json({ message: 'No user found' });

        let conversation = await conversationModel.findOne({
            members: { $all: [senderId, recieverId] }
        }).populate('messages').populate('members', 'username pfp');

        if (!conversation) return res.status(200).json({ success: true, messages: [] });

        res.status(200).json({ success: true, messages: conversation.messages });
    } catch (error) {
        console.log(error); // Add logging for debugging
        res.status(500).json({ message: 'Internal server error' });
    }
}
