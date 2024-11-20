const axios = require('axios');
const Product = require('../model/productModel');
const Order = require('../model/orderModel');
const catchAsync = require('../utils/catchAsync');

exports.createOrder = catchAsync(async (req, res, next) => {
  console.log(req.body);
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
      callback_url: `http://${req.get('host')}/verifyPayment/${txRef}`,
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
