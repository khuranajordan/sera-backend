const AppModel = require('../models/app.model.js');

const createApp = async (req, res) => {
  try {
    const { parentCode, childId, imageUrl, appName, packageName, versionName, status, versionCode } = req.body;
    const newApp = new AppModel({
      parentCode,
      childId,
      imageUrl,
      appName,
      packageName,
      versionName,
      status,
      versionCode
    });
    const savedApp = await newApp.save();
    res.status(201).json({
      status: 'success',
      message: 'App data posted successfully',
      data: savedApp
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createApp
};
