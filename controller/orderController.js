const axios = require('axios');
const Product = require('../model/productModel');
const Order = require('../model/orderModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const Email = require('../utils/Email');

exports.createOrder = catchAsync(async (req, res, next) => {
  const updatedCart = await Promise.all(
    req.body.cart.map(async (item) => {
      const product = await Product.findById(
        item.productId,
      );
      item.price = product.price;
      item.name = product.name;
      return item;
    }),
  );

  req.body.cart = updatedCart;
  req.body.user = req.user.id;
  req.body.email = req.user.email;
  req.body.phone = req.user.phone;
  req.body.totalPrice = updatedCart.reduce(
    (acc, cur) => acc + cur.price * cur.quantity,
    0,
  );

  const txRef = `chewatatest-66690912345678${Date.now()}`;
  req.body.transactionId = txRef;

  const session = await axios.post(
    'https://api.chapa.co/v1/transaction/initialize',
    {
      amount: req.body.totalPrice,
      currency: 'ETB',
      email: req.user.email,
      tx_ref: txRef,
      callback_url: `https://${req.get('host')}/verifyPayment/${txRef}`,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    },
  );

  req.body.paymentUrl = session?.data?.data?.checkout_url;

  const order = await Order.create(req.body);

  new Email(
    'Maraki-Fashion',
    req.body.email,
  ).sendPaymentUrl(req.body.paymentUrl, txRef);

  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});

exports.verifyPayment = async (req, res, next) => {
  const { txRef } = req.params;
  const response = await axios.get(
    `https://api.chapa.co/v1/transaction/verify/${txRef}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      },
    },
  );
  if (response.data.status === 'success') {
    const updatedOrder = await Order.findOneAndUpdate(
      { transactionId: txRef },
      {
        status: 'paid',
      },
      {
        new: true,
        runValidators: true,
      },
    );
    // console.log(response);
    new Email(
      'Maraki-Fashion',
      response.data.data.email,
    ).sendPaymentSuccessfullMessage();

    res.status(200).json({
      recieved: true,
    });
  } else
    res.status(200).json({
      status: 'failed',
      message:
        'Transaction verification failed. Invalid or unsuccessful transaction.',
      tx_ref: 'unique_reference_id',
    });
};

exports.getAllOrders = factory.getAll(Order);

exports.getCurrentUserOrders = catchAsync(
  async (req, res, next) => {
    const documents = await Order.find({
      user: req.user.id,
    });
    res.status(200).json({
      status: 'success',
      data: {
        documents,
      },
    });
  },
);
