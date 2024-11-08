const express = require('express');
const authController = require('../controller/authController');

const router = express.Router();

router.post('/signup', authController.singup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
module.exports = router;
