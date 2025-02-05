const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    attachments: [{
        name: String,
        url: String,
        type: String
    }],
    read: {
        type: Boolean,
        default: false
    },
    createdat: {
        type: Date,
        default: Date.now
    }
});

messageSchema.index({sender: 1, receiver: 1})

module.exports = mongoose.model('message',messageSchema);