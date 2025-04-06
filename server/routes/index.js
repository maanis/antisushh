var express = require('express');
const { register, login, logout } = require('../controllers/auth');
var router = express.Router();


router.post('/register', register);

router.post('/login', login);

router.get('/logout', logout);

module.exports = router;
