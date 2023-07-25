const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the parent device schema
const childSchema = new Schema({
  pairingCode: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        const code = value.toString();
        return code.length === 5;
      },
      message: 'Pairing code must be 5 digits long.'
    }
  },
  childId: {
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
  },
  device_token:{
    type: String,
    
  }
});

const Child = mongoose.model('Child', childSchema);

module.exports = {
  Child
};
