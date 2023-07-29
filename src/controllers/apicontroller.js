const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const {ParentDevice} = require('../models/parentDevice');
const {Child} = require('../models/child');
const PackageModel = require('../models/package.model');



const create = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      userisparent,
      mobile,
      isEmailVerified,
      isSubscribed,
      device_token
    } = req.body;
    if (
      !name ||
      !email ||
      !password ||
      !mobile ||
      !device_token
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // if (await User.isEmailTaken(email)) {
    //   return res.status(400).json({ message: 'Email is already taken' });
    // }
    if (await User.isMobileTaken(mobile)) {
      return res.status(400).json({ message: 'Mobile number is already taken' });
    }

    const user = new User({
      name,
      email,
      password,
      userisparent,
      mobile,
      isEmailVerified,
      isSubscribed,
      device_token,
    });

    try {
      await user.save();
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw new Error('Error creating user');
    }

    const token = jwt.sign({ id: user.id }, 'abcdefghijklmn'); 
    const response = {
      code: 200,
      message: 'User created successfully',
      user: {
        ...user.toJSON(),
        token: token,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Internal server error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};




const login = async (req, res) => {
  try {
    const {mobile, userisparent, password} = req.body;
    const user = await User.findOne({mobile});
    if (!user) {
      return res.status(401).json({message: 'Mobile number is not found'});
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({message: 'Password length should be a minimum of 8 characters'});
    }
    const isMatch = await user.isPasswordMatch(password);

    if (!isMatch) {
      return res.status(401).json({message: 'Password does not match'});
    }
    await User.updateOne(
      {
        _id: user.id,
      },
      {
        $set: {
          device_token: req.body.device_token,
        },
      }
    );
    const token = jwt.sign(user.id, 'abcdefghijklmn');

    const response = {
      code: 200,
      message: 'Login successful',
      user: {
        ...user.toJSON(),
        token: token,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.log(error.message, 'error');
    return res.status(400).json({message: error.message});
  }
};

const getCred = async (req, res) => {
  try {
    const users = await User.find();
    const response = {
      code: 200,
      message: 'success',
      data: users,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error(error.message); // Log the error for debugging purposes.
    return res.status(500).json({ message: 'Internal server error' });
  }
};


const generatePairingCode = async (req, res) => {
  try {
    const {deviceid} = req.body;
    let parentDevice = await ParentDevice.findOne({deviceid});

    if (parentDevice) {
      const childData = await Child.find({
        pairingCode: parentDevice.pairingCode,
      });
      const response = {
        status: 200,
        message: 'Success',
        deviceid: deviceid,
        pairingCode: parentDevice.pairingCode,
        childData: childData || [], // Initialize with an empty array
      };
      return res.status(200).json(response);
    }

    const newPairingCode = generateNewPairingCode();
    parentDevice = new ParentDevice({
      pairingCode: newPairingCode,
      deviceid: deviceid,
    });
    await parentDevice.save();

    const response = {
      status: 200,
      message: 'Success',
      deviceid: deviceid,
      pairingCode: newPairingCode,
      childData: [],
    };
    return res.status(200).json(response);
  } catch (error) {
    console.log(error.message, 'error');
    return res.status(500).json(error.message);
  }
};

const generateNewPairingCode = () => {
  const min = 10000;
  const max = 99999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const addChildApp = async (req, res) => {
  try {
    const {deviceid, pairingCode, name, age,childId, device_token} = req.body;
    const childIds = generateNewPairingCode();
    const childApp = new Child({
      pairingCode,
      deviceid,
      name,
      age,
      childId:childIds,
      device_token
    });
    const savedChild = await childApp.save();
    const {_id, __v, ...responseData} = savedChild.toObject();
    const response = {
      status: 200,
      message: 'Success',
      ...responseData,
    };
    return res.status(200).json(response);
  } catch (error) {
    console.log(error.message, 'error');
    return res.status(500).json(error.message);
  }
};

const pairChildDevice = async (req, res) => {
  try {
    const {deviceid, pairingCode, name, age} = req.body;
    const parentDevice = await ParentDevice.findOne({
      pairingCode,
    });

    if (!parentDevice) {
      res.status(404).json({error: 'Parent device not found'});
      return;
    }
    const childApp = new Child({
      pairingCode,
      deviceid,
      name,
      age,
    });
    const savedChild = await childApp.save();
    const {_id, __v, ...responseData} = savedChild.toObject();

    const response = {
      status: 200,
      message: 'Success',
      ...responseData,
    };
    return res.status(200).json(response);
  } catch (error) {
    console.log(error.message, 'error');
    return res.status(500).json(error.message);
  }
};

const getChildDataByPairingCode = async (req, res) => {
  try {
    const {pairingCode} = req.body;
    const childData = await Child.find({pairingCode});

    if (childData.length === 0) {
      res
        .status(404)
        .json({error: 'No child data found for the provided pairing code'});
      return;
    }

    return res.status(200).json(childData);
  } catch (error) {
    console.log(error.message, 'error');
    return res.status(500).json(error.message);
  }
};

const forgetpassword = async (req, res) => {
  try {
    let data = await User.findOne({mobile: req.body.mobile});
    if (!data) {
      return res.status(402).json({message: 'mobile is not found'});
    }
    const response = {
      status: 200,
      message: 'Success',
      mobile: data.mobile,
    };
    return res.status(200).json(response);
  } catch (error) {
    console.log(error.message, 'error');
    return res.status(500).json(error.message);
  }
};

const reset_password = async (req, res) => {
  try {
    let {mobile, password, confirmPassword} = req.body;
    if (password.length < 8) {
      return res
        .status(400)
        .json({message: 'Password length should be a minimum of 8 characters'});
    }
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({message: 'Password and confirm password do not match'});
    }
    const user = await User.findOne({mobile});
    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }
    user.password = password;
    await user.save();
    const response = {
      status: 200,
      message: 'Success',
    };
    return res.status(200).json(response);
  } catch (error) {
    console.log(error.message, 'error');
    return res.status(500).json(error.message);
  }
};

const createPackage = async (req, res) => {
  try {
    const {
      price,
      off,
      numberOfDays,
      isPromoCode,
      promoCode,
      packageId,
      packageName,
      packageDetails,
    } = req.body;
    const newPackage = new PackageModel({
      price,
      off,
      numberOfDays,
      isPromoCode,
      promoCode,
      packageId,
      packageName,
      packageDetails,
    });
    const savedPackage = await newPackage.save();
    res.status(201).json({
      status: 201,
      message: 'Package created successfully',
      package: savedPackage,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: 'Error creating package',
      error: err.message,
    });
  }
};

const filterPackagesByPromoCode = async (req, res) => {
  try {
    const {promoCode} = req.body;
    const filteredPackages = await PackageModel.find({promoCode});
    const totalItems = filteredPackages.length;
    res.status(200).json({
      status: 200,
      message: 'Packages filtered successfully',
      totalItems,
      packages: filteredPackages,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: 'Error filtering packages by promoCode',
      error: err.message,
    });
  }
};

const deletePackageById = async (req, res) => {
  try {
    const {id} = req.params;
    const deletedPackage = await PackageModel.findByIdAndDelete(id);

    if (!deletedPackage) {
      // If no package is found with the provided ID
      return res.status(404).json({
        status: 404,
        message: 'Package not found',
      });
    }
    res.status(200).json({
      status: 200,
      message: 'Package deleted successfully',
      package: deletedPackage,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: 'Error deleting package',
      error: err.message,
    });
  }
};

const updatePackageById = async (req, res) => {
  try {
    const {id} = req.params;
    const updateFields = req.body;

    const updatedPackage = await PackageModel.findByIdAndUpdate(
      id,
      updateFields,
      {new: true},
    );

    if (!updatedPackage) {
      return res.status(404).json({
        status: 404,
        message: 'Package not found',
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Package updated successfully',
      package: updatedPackage,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: 'Error updating package',
      error: err.message,
    });
  }
};

const getAllPackages = async (req, res) => {
  try {
    const allPackages = await PackageModel.find();
    const totalItems = allPackages.length;
    res.status(200).json({
      status: 200,
      message: 'All packages retrieved successfully',
      totalItems: totalItems,
      packages: allPackages,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: 'Error retrieving packages',
      error: err.message,
    });
  }
};

const fetchSubscribedPackages = async (deviceId, parentId) => {
  try {
    const subscribedPackages = await PackageModel.find({deviceId, parentId});
    return subscribedPackages;
  } catch (err) {
    throw new Error('Error fetching subscribed packages: ' + err.message);
  }
};
const getSubscribedPackages = async (deviceId, parentId) => {
  const packages = await fetchSubscribedPackages(deviceId, parentId);
  return packages;
};

const getSubscription = async (req, res) => {
  try {
    const {deviceId, parentId} = req.query;

    const packages = await getSubscribedPackages(deviceId, parentId);
    res.status(200).json({
      status: 200,
      message: 'Success',
      packages: packages,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: 'Error while fetching subscriptions.',
      error: err.message,
    });
  }
};

const calculateSubscriptionAmount = (packageId, promoCode) => {
  const subscriptionPlans = {
    monthly: {duration: 30, price: 600, maxDevices: 1},
    quarterly: {duration: 90, price: 3000, maxDevices: 2},
    yearly: {duration: 365, price: 6000, maxDevices: 4},
  };

  if (!(packageId in subscriptionPlans)) {
    throw new Error('Invalid packageId: ' + packageId);
  }

  let durationIncrease = 0;
  const validPromoCodes = Array.from(
    {length: 91},
    (_, i) => `sera${String(10 + i).padStart(3, '0')}`,
  );
  if (validPromoCodes.includes(promoCode)) {
    if (packageId === 'quarterly') {
      durationIncrease = 30;
    } else if (packageId === 'yearly') {
      durationIncrease = 180;
    }
  } else {
    throw new Error('Invalid promoCode: ' + promoCode);
  }

  const {duration, price, maxDevices} = subscriptionPlans[packageId];
  const totalAmount = price;
  const updatedDuration =
    packageId === 'monthly' ? duration : duration + durationIncrease;

  return {
    totalAmount,
    packageAmount: price,
    duration: updatedDuration,
    maxDevices,
  };
};

const postSubscription = async (req, res) => {
  try {
    const { packageId, promoCode } = req.body;
    const lowerCasePackageId = packageId.toLowerCase();
    
    const { totalAmount, packageAmount, duration, maxDevices } =
      await calculateSubscriptionAmount(lowerCasePackageId, promoCode);
    res.status(200).json({
      status: 200,
      message: 'Success',
      totalAmount,
      packageAmount,
      duration,
      maxDevices,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: 'Error while processing subscription.',
      error: err.message,
    });
  }
};

module.exports = {
  create,
  login,
  getCred,
  generatePairingCode,
  addChildApp,
  pairChildDevice,
  getChildDataByPairingCode,
  forgetpassword,
  reset_password,
  createPackage,
  filterPackagesByPromoCode,
  deletePackageById,
  updatePackageById,
  getAllPackages,
  getSubscription,
  postSubscription,
};
