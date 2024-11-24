const Email = require('../utils/Email');

exports.sendEmail = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    const emailSender = new Email(name, email);

    await emailSender.sendMessage(message);
    await emailSender.sendReply();
    res.status(200).json({
      status: 'success',
      message: 'Email has been sent successfully!',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message:
        'Email have not been sent. Please try again later!',
    });
  }
};
