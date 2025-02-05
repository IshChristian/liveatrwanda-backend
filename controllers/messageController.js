const Message = require("../models/messageModels");
const User = require("../models/userModels");

// ✅ Send a new message
exports.sendMessage = async (req, res) => {
    const { sender, receiver, content, attachments } = req.body;

    try {
        // ✅ Check if sender and receiver exist
        const senderExists = await User.findById(sender);
        const receiverExists = await User.findById(receiver);

        if (!senderExists || !receiverExists) {
            return res.status(404).json({ message: "Sender or Receiver not found" });
        }

        // ✅ Create new message
        const newMessage = new Message({
            sender,
            receiver,
            content,
            attachments: attachments || [], // Default empty array if no attachments
        });

        const savedMessage = await newMessage.save();

        res.status(201).json({
            message: "Message sent successfully",
            data: savedMessage,
        });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Failed to send message", error: error.message });
    }
};

// ✅ Get messages between two users
exports.getMessages = async (req, res) => {
    const { senderID, receiverID } = req.params;

    try {
        const messages = await Message.find({
            $or: [
                { sender: senderID, receiver: receiverID },
                { sender: receiverID, receiver: senderID }
            ]
        }).sort({ createdat: 1 }); // ✅ Sort by date

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Failed to fetch messages", error: error.message });
    }
};

// ✅ Mark messages as read
exports.markMessagesAsRead = async (req, res) => {
    const { senderID, receiverID } = req.params;

    try {
        const updatedMessages = await Message.updateMany(
            { sender: senderID, receiver: receiverID, read: false },
            { $set: { read: true } }
        );

        res.status(200).json({
            message: "Messages marked as read",
            updatedCount: updatedMessages.modifiedCount,
        });
    } catch (error) {
        console.error("Error marking messages as read:", error);
        res.status(500).json({ message: "Failed to update messages", error: error.message });
    }
};

// ✅ Delete a message
exports.deleteMessage = async (req, res) => {
    const { messageID } = req.params;

    try {
        const deletedMessage = await Message.findByIdAndDelete(messageID);

        if (!deletedMessage) {
            return res.status(404).json({ message: "Message not found" });
        }

        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({ message: "Failed to delete message", error: error.message });
    }
};
