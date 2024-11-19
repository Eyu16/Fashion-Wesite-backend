const express = require('express');
const authController = require('../controller/authController');
const userController = require('../controller/userController');

const router = express.Router();
router.post('/signup', authController.singup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get(
  '/currentUser',
  authController.protect,
  userController.getCurrentUser,
);
module.exports = router;
