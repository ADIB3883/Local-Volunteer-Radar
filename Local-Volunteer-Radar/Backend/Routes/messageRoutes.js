const express = require('express');
const {
    getMessages,
    markAsRead,
    getUnreadCount
} = require('../controllers/messageController');

const router = express.Router();

router.get('/:conversationId', getMessages);
router.post('/mark-read', markAsRead);
router.get('/unread/:userId', getUnreadCount);

module.exports = router;
