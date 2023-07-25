const mongoose = require('mongoose');

const childDataSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  appName: {
    type: String,
    required: true,
  },
  packagename: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  versionCode: {
    type: String,
    required: true,
  },
});

const childSchema = new mongoose.Schema({
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
  data: [childDataSchema],
});

const ChildModel = mongoose.model('ChildApp', childSchema);
module.exports = ChildModel;
