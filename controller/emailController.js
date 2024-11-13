const Email = require('../utils/Email');

exports.sendEmail = async (req, res, next) => {
  try {
    console.log(req.body);
    const { name, email, message } = req.body;
    const emailSender = new Email(name, email);
    const messageId =
      await emailSender.sendMessage(message);
    await emailSender.sendReply(messageId);
    res.status(200).json({
      status: 'success',
      message: 'Email has been sent successfully!',
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 'fail',
      message:
        'Email have not been sent. Please try again later!',
    });
  }
};
