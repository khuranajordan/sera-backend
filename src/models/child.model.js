const mongoose = require('mongoose');
const childSchema = new mongoose.Schema({
  pairingcodeforchild: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        const code = value.toString();
        return code.length === 5;
      },
      message: 'Pairing code must be 5 digits long.',
    },
  },
  deviceid: {
    type: String,
    required: true,
  },
  childId: {
    type: Number,
    required: true,
  },
  data: [
    {
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
        type: Number,
        required: true,
      },
      status: {
        type: Boolean,
        required: true,
      },
      versionCode: {
        type: Number,
        required: true,
      },
    },
  ],
});

const ChildModel = mongoose.model('ChildApp', childSchema);

module.exports = ChildModel;
