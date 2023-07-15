const { User } = require('../models');
const jwt = require('jsonwebtoken');

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
    const { name, email, password, confirmPassword, userisparent, mobile } = req.body;

    if (!name || !email || !password || !confirmPassword || !userisparent || !mobile) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
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


module.exports = {
  create,
  login,
  getCred,
};
