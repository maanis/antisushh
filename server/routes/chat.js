var express = require('express');
const isAuthenticated = require('../middlewares/isAuthenticated');
const { sendMessage, getMessages, deleteMessage, msgsToRead } = require('../controllers/messageController');
var router = express.Router();

router.post('/sendMessage/:id', isAuthenticated, sendMessage);
router.get('/getMessages/:id', isAuthenticated, getMessages);
router.get('/msgsToRead', isAuthenticated, msgsToRead);
router.post('/unsend/:messageId', isAuthenticated, deleteMessage);

module.exports = router;
