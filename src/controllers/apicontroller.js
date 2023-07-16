const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { ParentDevice } = require('../models/parentDevice');
const { child } = require('../models/child');

// Define the decryptPass function
const decryptPass = encryptedPassword => {
  // Implement your decryption logic here, for example using bcrypt
  // You can adjust this function to match the encryption method you are using
  const decryptedPassword = bcrypt.compareSync(
    'plainPassword',
    encryptedPassword,
  );
  return decryptedPassword;
};

const create = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, userisparent, mobile, isEmailVerified } = req.body;

    if (!name || !email || !password || !confirmPassword || !userisparent || !mobile || !isEmailVerified) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if password length is less than 8 characters
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password length should be a minimum of 8 characters' });
    }

    const user = await User.create({
      name,
      email,
      password,
      confirmPassword,
      userisparent,
      mobile,
      isEmailVerified
    });

    const token = jwt.sign(user.id, 'abcdefghijklmn');

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
    console.log(error.message, 'error');
    return res.status(404).json({ message: error.message });
  }
};


const login = async (req, res) => {
  try {
    const { mobile, userisparent, password } = req.body;
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(202).json({ message: 'Mobile number is not found' });
    }

    // Check if password length is less than 8 characters
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password length should be a minimum of 8 characters' });
    }

    const isMatch = await user.isPasswordMatch(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Password does not match' });
    }

    const token = jwt.sign(user.id, 'abcdefghijklmn');

    const response = {
      code: 200,
      message: 'Login successful',
      data: {
        ...user.toJSON(),
        token: token,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.log(error.message, 'error');
    return res.status(400).json({ message: error.message });
  }
};


const getCred = async (req, res) => {
  try {
    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    const response = {
      code: 200,
      message: 'success',
      data: users,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.log(error.message, 'error');
    return res.status(500).json({ message: 'Internal server error' });
  }
};


const generatePairingCode = async(req,res)=>{
  try {
    const { deviceid } = req.body;
    
    // Generate a random pairing code
    const pairingCode = Math.floor(Math.random() * 100000);
    
    // Save the parent device with the pairing code
    const parentDevice = new ParentDevice({
      deviceid,
      pairingCode
    });
    await parentDevice.save();
    // Prepare the response JSON
    const response = {
      "pairing_code": pairingCode
    };
    
    return res.status(200).json(response);
  } catch (error) {
    console.log(error.message, 'error');
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const pairChildDevice = async(req, res)=>{
  try {
    const { deviceid, pairing_code } = req.body;
    
    // Find the parent device with the provided pairing code
    const parentDevice = await ParentDevice.findOne({ pairingCode: pairing_code });
    if (!parentDevice) {
      res.status(404).json({ error: 'Parent device not found' });
      return;
    }
    
    // Save the child app data with the parent's device ID and pairing code
    const childApp = new child({
      pairingCode: pairing_code,
      deviceid,
      age: req.body.age
    });
    await childApp.save();
    
    // Prepare the response JSON
    const response = {
      "status": 200,
      "message": "Success",
      "deviceid":deviceid,
      "pairingCode":pairing_code
    };
    return res.status(200).json(response);
  } catch (error) {
    console.log(error.message, 'error');
    return res.status(500).json( error.message );
  }
}


const forgetpassword = async(req,res)=>{
  try {
    let data = await User.findOne({mobile:req.body.mobile})
    if(!data){
      return res.status(402).json({message:"mobile is not found"})
    }
    const response = {
      "status": 200,
      "message": "Success",
      "mobile":data.mobile
    };
    return res.status(200).json(response)
    
  } catch (error) {
    console.log(error.message, 'error');
    return res.status(500).json( error.message );
  }
}

const reset_password = async (req, res) => {
  try {
    // Find the user by mobile
    let { mobile, newPassword } = req.body;

    // Check if password length is less than 8 characters
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password length should be a minimum of 8 characters' });
    }

    const user = await User.findOne({ mobile });

    // If the user with the provided mobile number doesn't exist, return an error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's password in the database
    user.password = newPassword;

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




const getSubscribedPackages = async (deviceId, parentId) => {
  // You can implement the logic to fetch the subscribed packages from your database using the deviceId and parentId
  // Here, we'll provide a sample response for demonstration purposes
  return [
    {
      price:99,
      numberOfDays:30,
      isPromoCode:false,
      packageId: 737373,
      packageName: 'quarterly50% off',
      packageDetails: 'In this package, you can only add four devices...',
    },
    {
      price:99,
      numberOfDays:30,
      isPromoCode:true,
      packageId: 737374,
      packageName: 'single50% off',
      packageDetails: 'In this package, you can only add a single device...',
    },
  ];
};

const getSubscription = async (req, res) => {
  try {
    const { deviceId, parentId } = req.body;

    // Assuming you have a function to retrieve the subscribed packages based on the parentId and deviceId
    const packages = await getSubscribedPackages(deviceId, parentId);
    res.status(200).json({
      status: 200,
      message: 'success',
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

const calculateSubscriptionAmount = async (packageId, promoCode) => {
  return {
    totalAmount: 80,
    packageAmount: 100,
    discountAmount: 20,
  };
};

const postSubscription = async (req, res) => {
  try {
    const { packageId, promoCode } = req.body;

    const { totalAmount, packageAmount, discountAmount } = await calculateSubscriptionAmount(packageId, promoCode);
    res.status(200).json({
      status: 200,
      message: 'success',
      totalAmount: totalAmount,
      packageAmount: packageAmount,
      discountAmount: discountAmount,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
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
  pairChildDevice,
  forgetpassword,
  reset_password,
  getSubscription,
  postSubscription
};
