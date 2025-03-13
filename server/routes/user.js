var express = require('express');
const { suggestedUser, editProfile, updateProfile, userProfile, searchQuerry, sendRequest, declineRequest, acceptRequest, updatePfp, updatecoverPhoto } = require('../controllers/auth');
const isAuthenticated = require('../middlewares/isAuthenticated');
const upload = require('../config/multer');
var router = express.Router();

router.get('/', function (req, res) {
    res.send('user');
});

router.post('/sendRequest/:id', isAuthenticated, sendRequest);
router.post('/declineRequest/:id', isAuthenticated, declineRequest);
router.post('/acceptRequest/:id', isAuthenticated, acceptRequest);

router.get('/suggestedUser', isAuthenticated, suggestedUser);

router.get('/userProfile/:username', isAuthenticated, userProfile);

router.get('/searchQuerry/:username', isAuthenticated, searchQuerry);

router.post('/updateProfile', isAuthenticated, upload.single('profilePic'), updateProfile);

router.post('/editProfile', isAuthenticated, upload.single('image'), editProfile);

router.post('/updatePfp', isAuthenticated, upload.single('profilePic'), updatePfp);

router.post('/updateCoverPhoto', isAuthenticated, upload.single('coverPhoto'), updatecoverPhoto);




module.exports = router;
