const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    source: {type: String, required: true},
    amount: {type: String, required: true, value: 0},
    createdAt: {type: String, required: true},
    userID: {type: String, required: true}
});

module.exports = mongoose.model('income', incomeSchema)