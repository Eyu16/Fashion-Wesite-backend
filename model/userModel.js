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
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 8);
  next();
});

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
