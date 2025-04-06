var express = require('express');
const isAuthenticated = require('../middlewares/isAuthenticated');
const upload = require('../config/multer');
const { createPost, getAllPosts, getUserPosts, likeOrDislike, addComments, deletePost, addOrRemoveToBookmark, getBookmarks, getPost } = require('../controllers/postController');
var router = express.Router();

router.post('/create', isAuthenticated, upload.single('image'), createPost);

router.get('/getAllPosts', isAuthenticated, getAllPosts);

router.get('/getPost/:id', isAuthenticated, getPost);

router.get('/getUserPosts', isAuthenticated, getUserPosts);

router.post('/likeOrDislike/:id', isAuthenticated, likeOrDislike);

router.post('/addComments/:id', isAuthenticated, addComments);

router.delete('/deletePost/:id', isAuthenticated, deletePost);

router.post('/addOrRemoveToBookmark/:id', isAuthenticated, addOrRemoveToBookmark);

router.get('/getBookmarks', isAuthenticated, getBookmarks);





module.exports = router;
