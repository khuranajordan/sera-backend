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
    required: true
  }
});

const ParentDevice = mongoose.model('ParentDevice', parentDeviceSchema);

module.exports = {
    ParentDevice
  };