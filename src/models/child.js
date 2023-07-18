const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the parent device schema
const childSchema = new Schema({
  pairingCode: {
    type: String,
    required: true
  },
  deviceid: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  }
});

const Child = mongoose.model('Child', childSchema);

module.exports = {
  Child
};
