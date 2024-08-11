const express = require('express');
const { isAuthenticated } = require('../middlewares/auth');

const { registerUser, loginUser, followUser, logoutUser, updatePassword, updateUserProfile, deleteUserProfile, getMyProfile, getUserProfile, getAllUsers } = require('../controllers/user');

const router = express.Router();

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/logout').post(logoutUser);

router.route('/follow/:id').get(isAuthenticated, followUser);

router.route('/update/password').put(isAuthenticated, updatePassword);

router.route('/update/profile').put(isAuthenticated, updateUserProfile);

router.route('/delete/profile').delete(isAuthenticated, deleteUserProfile);

router.route('/myProfile').get(isAuthenticated, getMyProfile);

router.route('/user/:id').get(isAuthenticated, getUserProfile);

router.route('/user/all').get(isAuthenticated, getAllUsers);



module.exports = router;

