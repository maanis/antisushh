var express = require('express');
const { followOrUnfollow, suggestedUser, editProfile } = require('../controllers/auth');
const isAuthenticated = require('../middlewares/isAuthenticated');
const upload = require('../config/multer');
var router = express.Router();

router.get('/', function (req, res) {
    res.send('user');
});

router.post('/followorunfollow/:id', isAuthenticated, followOrUnfollow);

router.get('/suggestedUser', isAuthenticated, suggestedUser);

router.post('/editProfile', isAuthenticated, upload.single('image'), editProfile);



module.exports = router;
