const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'property',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending','responded','closed'],
        default: 'pending'
    },
    viewingDate: Date,
    createdAt: {
        type: Date,
        default: Date.now
    } 
});

module.exports = mongoose.model('inquiry', inquirySchema);