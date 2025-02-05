const mongoose = require('mongoose');

const CateSchema = new mongoose.Schema({
    name: {type: String, required: true},
    createdAt: {type: String, required: true},
    userID: {type: String, required: true},
    username: {type: String, required: true, unique: true},
})


module.exports = mongoose.model('category', CateSchema);