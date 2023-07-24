const AppModel = require('../models/app.model.js');
const PairingModel = require('../models/pairing.model.js');
const ChildModel = require('../models/child.model.js'); 


const createApp = async (req, res) => {
  try {
    const { parentCode, childId, deviceid, appName, packageName, version, status, versionCode } = req.body;
    const imageUrl = req.file.buffer; 
    if (!parentCode || !childId || !deviceid || !imageUrl || !appName || !packageName || !version || !versionCode) {
      return res.status(400).json({ error: 'All fields are required' });
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



const childAppList = async (req, res) =>{
  try {
    let {parentCode,childId } =  req.body
    let data  =  await AppModel.find({parentCode:parentCode,childId:childId} )
    if(!data){
      return res.status(404).json({error: 'parent Code and Child Id not found'});
    }
    return res.status(200).json(data);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
} 

const AppUsageGetting = async (req, res) =>{
  try {
    let {pairingcodeforchild,childId } =  req.body
    let data  =  await ChildModel.find({pairingcodeforchild, childId:childId} )
    if(!data){
      return res.status(404).json({error: 'parent Code and Child Id not found'});
    }
    
    return res.status(200).json(data);

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
} 


const AppUsageSending = async (req, res) => {
  try {
    const pairingData = req.body;
    const pairing = await ChildModel.create(pairingData);
    res.status(201).json(pairing);
  } catch (error) {
    console.log(error.message);
    res.status(500).json( error.message );
  }
};

const createChild = async (req, res) => {
  try {
    const newChild = new ChildModel(req.body);
    const savedChild = await newChild.save();
    res.status(201).json({
      "status": 1,
      "message": "Success"    
    }); 
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  createApp,
  AppUsageSending,
  createChild,
  childAppList,
  AppUsageGetting
};
