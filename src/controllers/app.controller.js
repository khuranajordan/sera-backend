const AppModel = require('../models/app.model.js');
const PairingModel = require('../models/pairing.model.js');
const ChildModel = require('../models/child.model.js');

const BlockChildApp = async (req, res) => {
  try {
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
