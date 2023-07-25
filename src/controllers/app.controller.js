const AppModel = require('../models/app.model.js');
const PairingModel = require('../models/pairing.model.js');
const ChildModel = require('../models/child.model.js');

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
      var serverKey =
        'AAAAQmBk1Ns:APA91bEHMhIsFZSpUnRjEy8l25GVrbVVVTHg-RIzIXi8kCjjm2K67yJst-Y-vr-8v3JQtlWAUVxY16Knn0E7BsBAaZZqX6MBtJKZIubHerFsbVAlZ-RdKuarCMp21jFOvalF991z95XQ';
      var fcm = new FCM(serverKey);

      fcm.send(new_message, function (err, response) {
        if (err) {
          console.log(
            err,
            'notifi eroorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
          );
        } else {
          console.log('Successfully sent with response: ', response);
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

    let reciever =  await User.find({mobile:req.body.mobile})
   
    const {
      parentCode,
      childId,
      deviceid,
      imageUrl,
      appName,
      packageName,
      version,
      status,
      versionCode,
    } = req.body;

    if (
      !parentCode ||
      !childId ||
      !deviceid ||
      !imageUrl ||
      !appName ||
      !packageName ||
      !version ||
      !versionCode
    ) {
      return res.status(400).json({error: 'All fields are required'});
    }
    const newApp = new AppModel({
      parentCode,
      childId,
      deviceid,
      imageUrl,
      appName,
      packageName,
      version,
      status,
      versionCode,
    });
    const savedApp = await newApp.save();

    var message = `${appName} Block the app`;
    var notification_data = {
      // "problemId":requestData.problemId,
      message: message,
      push_type: 1,
    };

    await send_push_notification(reciever.deviceToken, notification_data);

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

const AppUsageSending = async (req, res) => {
  try {
    await ChildModel.deleteMany({});
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


const SendChildAppList = async (req, res) => {
  try {
    await ChildModel.deleteMany({});

    const newChild = new ChildModel(req.body);
    const savedChild = await newChild.save();
    const {pairingcodeforchild, deviceid, childId, data} = savedChild;
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
