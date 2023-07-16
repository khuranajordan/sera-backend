// subscription.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const subscriptionSchema = new Schema({
    deviceId:{
        type: String,
        required: true
    },
    parentId :{
        type: String,
        required: true
    },
  packageId: {
    type: Number,
    required: true,
  },
  packageName: {
    type: String,
    required: true,
  },
  packageDetails: {
    type: String,
    required: true,
  },
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
