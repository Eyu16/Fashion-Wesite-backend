const catchAsync = require('../utils/catchAsync');

exports.getCurrentUser = catchAsync(
  async (req, res, next) => {
    console.log(req.user, 'userrrrrrrrrrrrrrrrr');
    res.status(200).json({
      status: 'success',
      data: {
        user: req.user,
      },
    });
  },
);
