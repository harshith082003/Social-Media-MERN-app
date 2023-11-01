const express = require('express');
const { createPost, likeAndUnlikePost, deletePost, getPostsOfFollowing, addComments, deleteComments } = require('../controllers/post');
const { isAuthenticated } = require('../middlewares/auth');

const router = express.Router();

router.route('/post/upload').post( isAuthenticated, createPost)

router
    .route('/post/comment/:id')
    .put( isAuthenticated, addComments)
    .delete(isAuthenticated, deleteComments)

router.route('/posts').get(isAuthenticated, getPostsOfFollowing)

router
    .route('/post/:id')
    .get( isAuthenticated, likeAndUnlikePost)
    .delete( isAuthenticated, deletePost)

module.exports = router;

