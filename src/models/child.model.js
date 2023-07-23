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
    type: Number,
    required: true,
  },
  childId: {
    type: Number,
    required: true,
  },
  data: [
    {
      appName: {
        type: String,
        required: true,
      },
      packagename: {
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
    },
  ],
});

const ChildModel = mongoose.model('ChildApp', childSchema);

module.exports = ChildModel;
