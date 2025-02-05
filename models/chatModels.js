const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'property'
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'message'
    },
    unreadCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active','archived'],
        default: 'active'
    }
});

module.exports = mongoose.model('chat', chatSchema);