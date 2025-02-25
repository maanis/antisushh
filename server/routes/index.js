var express = require('express');
const { register, login, followOrUnfollow, logout, suggestedUser, editProfile } = require('../controllers/auth');
const isAuthenticated = require('../middlewares/isAuthenticated');
const upload = require('../config/multer');
var router = express.Router();

router.get('/', function (req, res) {
  res.send('hey');
});

router.post('/register', register);

router.post('/login', login);

router.get('/logout', logout);

router.post('/followorunfollow/:id', isAuthenticated, followOrUnfollow);

router.get('/suggestedUser', isAuthenticated, suggestedUser);

router.post('/editProfile', isAuthenticated, upload.single('image'), editProfile);



module.exports = router;
