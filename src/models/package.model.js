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
  promoCode: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        return /^sera\d{3}$/.test(value);
      },
      message: props => `${props.value} is not a valid promoCode. It should be in the format "seraXXX" where XXX is a three-digit number.`,
    },
  },
  packageId: {
    type: String,
    required: true,
    enum: ['monthly', 'quarterly', 'yearly'],
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


