const mongoose = require('mongoose');

// Create a schema for the package data
const packageSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
  },
  numberOfDays: {
    type: Number,
    required: true,
  },
  isPromoCode: {
    type: Boolean,
    required: true,
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

// Create a model using the schema
const PackageModel = mongoose.model('Package', packageSchema);

module.exports = PackageModel;
