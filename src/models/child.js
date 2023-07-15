const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the parent device schema
const childSchema = new Schema({
  deviceid: {
    type: String,
    required: true
  },
  pairingCode: {
    type: Number,
    required: true
  },
  age: {
    type: Number,
    min: 0,
    max: 18,
    required: true
  }
});

const child = mongoose.model('child', childSchema);

module.exports = {
    child
  };