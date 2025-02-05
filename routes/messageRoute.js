const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');


router.post('/newmessage', messageController.sendMessage);
router.get('/getmessage', messageController.markMessagesAsRead);
router.put('/delete/:id', messageController.deleteMessage);
router.delete('/message', messageController.getMessages);

module.exports = router;
