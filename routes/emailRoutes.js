const express = require('express');
const emailController = require('../controller/emailController');

const router = express.Router();

router.route('/contact').post(emailController.sendEmail);

module.exports = router;
