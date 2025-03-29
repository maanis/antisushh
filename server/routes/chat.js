var express = require('express');
const isAuthenticated = require('../middlewares/isAuthenticated');
const { sendMessage, getMessages } = require('../controllers/messageController');
var router = express.Router();

router.get('/', function (req, res) {
    res.send('chat');
});


router.post('/sendMessage/:id', isAuthenticated, sendMessage);
router.get('/getMessages/:id', isAuthenticated, getMessages);

module.exports = router;
