const mongoose = require('mongoose');

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
    type: Buffer, // Change the type to Buffer to store bitmap
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
    default: false,
    required: true
  },
  versionCode: {
    type: Number,
    required: true
  }
});

const AppModel = mongoose.model('App', appSchema);
module.exports = AppModel;
