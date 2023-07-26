const AppModel = require('../models/app.model.js');
const PairingModel = require('../models/pairing.model.js');
const ChildModel = require('../models/child.model.js');
const {Child} = require('../models/child');

const FCM = require('fcm-node');
var admin = require('firebase-admin');

var serviceAccount = require('../controllers/sera-a3a21-firebase-adminsdk-uxfg8-dbe56f1aa3.json');
const User = require('../models/user.model.js');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

  //push notification function for andriod
  const send_push_notification = async function (
    device_token,
    notification_data,
  ) {
    try {
      if (device_token !== '' && !Array.isArray(device_token)) {
        console.log(
          'device_token--------------------------------------',
          device_token,
        );
        // console.log("{{{{{{{{{{{{{{{{{{{{{")

        var new_message = { 
          to: device_token,
          data: notification_data,
        };
        console.log(new_message);
        var serverKey =
          'AAAAcq8kSY0:APA91bEQ-SQnIV5SK9-nJHe40eliMWRd2TYom-QohlRYC0p1VryXqBO9ynt7-P4RBo2jhVMlVooWS5dWScgimAzk1DeCdb3HShjGNyf7naD4j2Ldt12j1zZEdpzujC1KiHOwQfbt_ZgE';
        var fcm = new FCM(serverKey);
        fcm.send(new_message, function (err, response) {
          if (err) {
            console.error('Error sending push notification:', err);
            // Log additional details from the response (if available)
            console.error('FCM Response:', response);
          } else {
            console.log('Successfully sent with response:', response);
          }
        });
      } else {
        console.log('Invalid device_token');
      }
    } catch (err) {
      throw new Error(`Error while decoding token::: ${err}`);
    }
  };

const BlockChildApp = async (req, res) => {
  try {

    let reciever =  await Child.find({childId:req.body.childId})
    console.log(reciever);
   console.log(reciever[0].device_token);
    const {
      parentCode,
      childId,
      appName,
      packageName,

      status,
    } = req.body;

    if (
      !parentCode ||
      !childId ||
      !appName ||
      !packageName 
    ) {
      return res.status(400).json({error: 'All fields are required'});
    }
    const newApp = new AppModel({
      parentCode,
      childId,

      appName,
      packageName,
      status,
    });
    const savedApp = await newApp.save();

    var notification_data = {
      // "problemId":requestData.problemId,
      body: packageName,
      title:appName,
      status: status,
    };

    await send_push_notification(reciever[0].device_token, notification_data);

    res.status(201).json({
      status: 'success',
      message: 'App data posted successfully',
      data: savedApp,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Server error'});
  }
};



const AppUsageSending = async (req, res) => {
  try {
    await PairingModel.deleteMany({});
    const newPair = new PairingModel(req.body);
    const savedPaired = await newPair.save();
    const { pairingcodeforchild, deviceid, childId, data } = savedPaired;
    const responseObj = {
      status: 200,
      message: 'Success',
      pairingcodeforchild,
      deviceid,
      childId,
      data,
    };

    res.status(201).json(responseObj);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const AppUsageGetting = async (req, res) => {
  try {
    const {pairingcodeforchild, childId} = req.body;
    const data = await PairingModel.find({pairingcodeforchild, childId});

    if (data.length === 0) {
      return res
        .status(404)
        .json({error: 'Parent Code and Child Id not found'});
    }
    const {
      pairingcodeforchild: pairedCode,
      deviceid,
      childId: childIdFromData,
    } = data[0];

    return res.status(200).json({
      status: 1,
      message: 'Success',
      pairingcodeforchild: pairedCode, // Include the pairingcodeforchild in the response with the new variable name
      deviceid, // Include the deviceid in the response
      childId: childIdFromData, // Include the childId in the response with the new variable name
      data: data[0].data, // Include the data array in the response
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({error: 'Internal server error'});
  }
};


const SendChildAppList = async (req, res) => {
  try {
    await ChildModel.deleteMany({});
    const { pairingcodeforchild, deviceid, childId, data } = req.body;
    if (!pairingcodeforchild || !deviceid || !childId || !data) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newChild = new ChildModel({
      pairingcodeforchild,
      deviceid,
      childId,
      data,
    });

    const savedChild = await newChild.save();
    const responseObj = {
      status: 201,
      message: 'Success',
      pairingcodeforchild: savedChild.pairingcodeforchild,
      deviceid: savedChild.deviceid,
      childId: savedChild.childId,
      data: savedChild.data,
    };

    res.status(201).json(responseObj);
  } catch (error) {
    console.error('Error saving child:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const ChildAppList = async (req, res) => {
  try {
    const {pairingcodeforchild, childId} = req.body;
    const data = await ChildModel.find({pairingcodeforchild, childId});

    if (data.length === 0) {
      return res
        .status(404)
        .json({error: 'Parent Code and Child Id not found'});
    }
    const {
      pairingcodeforchild: pairedCode,
      deviceid,
      childId: childIdFromData,
    } = data[0];

    return res.status(200).json({
      status: 1,
      message: 'Success',
      pairingcodeforchild: pairedCode, // Include the pairingcodeforchild in the response with the new variable name
      deviceid, // Include the deviceid in the response
      childId: childIdFromData, // Include the childId in the response with the new variable name
      data: data[0].data, // Include the data array in the response
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({error: 'Internal server error'});
  }
};

module.exports = {
  BlockChildApp,
  AppUsageSending,
  SendChildAppList,
  ChildAppList,
  AppUsageGetting,
};
