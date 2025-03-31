var express = require('express');
const { suggestedUser, editProfile, updateProfile, userProfile, searchQuerry, declineRequest, acceptRequest, updatePfp, updatecoverPhoto, sendOrRemoveRequest, getUser, getNotifications } = require('../controllers/auth');
const isAuthenticated = require('../middlewares/isAuthenticated');
const upload = require('../config/multer');
var router = express.Router();

router.get('/', function (req, res) {
    res.send('user');
});

router.post('/sendOrRemoveRequest', isAuthenticated, sendOrRemoveRequest);
router.post('/declineRequest/:id', isAuthenticated, declineRequest);
router.post('/acceptRequest/:id', isAuthenticated, acceptRequest);

router.get('/suggestedUser', isAuthenticated, suggestedUser);

router.get('/userProfile/:username', isAuthenticated, userProfile);
router.get('/getUser/:username', isAuthenticated, getUser);

router.get('/searchQuerry/:username', isAuthenticated, searchQuerry);

router.get('/getNotifications', isAuthenticated, getNotifications);

router.post('/updateProfile', isAuthenticated, upload.single('profilePic'), updateProfile);

router.post('/editProfile', isAuthenticated, upload.single('image'), editProfile);

router.post('/updatePfp', isAuthenticated, upload.single('profilePic'), updatePfp);

router.post('/updateCoverPhoto', isAuthenticated, upload.single('coverPhoto'), updatecoverPhoto);




module.exports = router;
