const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    cart: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: [
              true,
              'Cart Item must have productId!',
            ],
          },
          name: {
            type: String,
            required: [true, 'Cart Item must have a name!'],
          },
          quantity: {
            type: Number,
            required: [
              true,
              'Cart Item must have quantity!',
            ],
          },
          price: {
            type: Number,
            required: [true, 'Cart Item must have price!'],
          },
        },
      ],
      required: [true, 'Order must have a cart'],
      validate: {
        validator: (value) => {
          return Array.isArray(value) && value.length > 0;
        },
        message: 'Cart can not be empty!',
      },
    },
    totalPrice: {
      type: Number,
      required: [true, 'Order must have totalPrice'],
    },
    status: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order must belong to a user!'],
    },
    transactionId: {
      type: String,
      unique: true,
      required: [true, 'Order must have transaction Id!'],
    },
    paymentUrl: {
      type: String,
      required: [
        true,
        'Payment url is required for an order!',
      ],
    },
    email: {
      type: String,
      required: [true, 'user email is required'],
    },
    phone: {
      type: String,
      required: [true, 'user phone number is required'],
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
