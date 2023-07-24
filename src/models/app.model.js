const mongoose = require('mongoose');

// Define the schema
const appSchema = new mongoose.Schema({
  parentCode: {
    type: Number,
    required: true
  },
  childId: {
    type: Number,
    required: true
  },
  deviceid:{
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  appName: {
    type: String,
    required: true
  },
  packageName: {
    type: String,
    required: true
  },
  version: {
    type: Number,
    required: true
  },
  status: {
    type: Boolean,
    default:false,
    required: true
  },
  versionCode: {
    type: Number,
    required: true
  }
});

const AppModel = mongoose.model('App', appSchema);

module.exports = AppModel;
