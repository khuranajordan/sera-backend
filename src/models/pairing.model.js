const mongoose = require('mongoose');

// Define the sub-schema for 'data' array
const dataSchema = new mongoose.Schema({
  appName: {
    type: String,
    required: true,
  },
  packagename: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  lastTimeUsed: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  totalTime: {
    type: String,
    required: true,
  },
});

const pairingSchema = new mongoose.Schema({
  pairingcodeforchild: {
    type: Number,
    required: true,
  },
  deviceid: {
    type: String,
    required: true,
  },
  childId: {
    type: Number,
    required: true,
  },
  data: [dataSchema], // Using the dataSchema as an array of objects
});

// Create the model
const PairingModel = mongoose.model('Pairing', pairingSchema);

module.exports = PairingModel;
