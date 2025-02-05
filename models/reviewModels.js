const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'property',
        required: true
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    view: {
        type: Boolean,
        default: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    comment: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

reviewSchema.index({property: 1})

module.exports = mongoose.model('review', reviewSchema);