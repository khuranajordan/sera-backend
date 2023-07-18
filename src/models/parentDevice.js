const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the parent device schema
const parentDeviceSchema = new Schema({
  deviceid: {
    type: String,
    required: true
  },
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
  }
});

const ParentDevice = mongoose.model('ParentDevice', parentDeviceSchema);

module.exports = {
  ParentDevice
};