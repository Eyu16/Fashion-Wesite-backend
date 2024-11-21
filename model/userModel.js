const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'User must have an email!'],
    },
    password: {
      type: String,
      required: [true, 'User must have password!'],
      select: false,
    },
    passwordChangedAt: {
      type: Date,
      select: false,
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin'],
    },
    phone: {
      type: String,
      required: [true, 'user phone number is required'],
      unique: true,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 8);
  this.passwordChangedAt = new Date() - 60 * 1000;
  next();
});

userSchema.methods.passwordChangedAfter = function (
  JWTTimeStamp,
) {
  const passwordChangedAt =
    this.passwordChangedAt.getTime() / 1000;
  return passwordChangedAt > JWTTimeStamp;
};

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(
    candidatePassword,
    userPassword,
  );
};

const User = mongoose.model('User', userSchema);

module.exports = User;
