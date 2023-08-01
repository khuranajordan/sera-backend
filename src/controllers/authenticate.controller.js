const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');

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
      if (!name ||!email ||!password ||!mobile ||!device_token){
        return res.status(400).json({ message: 'All fields are required' });
      }
      if (await User.isEmailTaken(email)) {
        return res.status(409).json({ message: 'Email is already taken' });
      }
      if (await User.isMobileTaken(mobile)) {
        return res.status(409).json({ message: 'Mobile number is already taken' });
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
      const { mobile, password, confirmPassword } = req.body;
  
      // Check if password and confirmPassword are the same
      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }
  
      const user = await User.findOne({ mobile });
      if (!user) {
        return res.status(404).json({ message: 'Mobile number is not found' });
      }
  
      if (password.length < 8) {
        return res
          .status(400)
          .json({ message: 'Password length should be a minimum of 8 characters' });
      }
      
      const isMatch = await user.isPasswordMatch(password);
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Password does not match' });
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
      return res.status(400).json({ message: error.message });
    }
  };
  


  module.exports = {
    create,
    login,
  }