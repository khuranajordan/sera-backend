const mongoose = require('mongoose');
const { Schema } = mongoose;

const subscriptionSchema = new Schema({
  packageId: {
    type: String,
    required: true,
  },
  promoCode: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  packageAmount: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  maxDevices: {
    type: Number,
    required: true,
  },
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
