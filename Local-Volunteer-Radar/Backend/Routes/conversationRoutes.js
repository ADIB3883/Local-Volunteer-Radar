const express = require('express');
const {
    createConversation,
    getUserConversations
} = require('../controllers/conversationController');

const router = express.Router();

router.post('/', createConversation);
router.get('/:userId', getUserConversations);

module.exports = router;
