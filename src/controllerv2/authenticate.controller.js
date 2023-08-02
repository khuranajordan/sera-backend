const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');

const parent_register = async (req, res) => {
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
        return res.status(403).json({ message: 'All fields are required' });
      }

      let emails = await User.isEmailTaken(email)
      if (emails) {
        return res.status(401).json({ message: 'Email is already taken' });
      }
      let passworderror =await User.isMobileTaken(mobile)
      if (passworderror) {
        return res.status(401).json({ message: 'Mobile number is already taken' });
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
  
      
        await user.save();
      
  
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
      return res.status(500).json(error.message);
    }
  };
  
  
  
  
  const login = async (req, res) => {
    try {
      const { mobile, password,device_token } = req.body;

      if (!device_token ){
        return res.status(401).json({ message: ' device_token are required' });
      }
  
      // Check if password and confirmPassword are the same
      if (!password) {
        return res.status(401).json({ message: 'Passwords do not match' });
      }
  
      const user = await User.findOne({ mobile });
      if (!user) {
        return res.status(401).json({ message: 'Mobile number is not found' });
      }
  
      if (password.length < 8) {
        return res
          .status(403)
          .json({ message: 'Password length should be a minimum of 8 characters' });
      }
      
      const isMatch = await user.isPasswordMatch(password);
  
      if (!isMatch) {
        return res.status(401).json({ message: 'Password does not match' });
      }
  
      await User.updateOne(
        {
          mobile: req.body.mobile,
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
      return res.status(401).json({ message: error.message });
    }
  };

  const forgetpassword = async (req, res) => {
    try {
      let data = await User.findOne({mobile: req.body.mobile});
      if ( req.body.mobile == ""){
        return res.status(403).json({message: 'mobile is not be empty'})
      }
      if (!data ) {
        return res.status(403).json({message: 'data is not found'});
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
      let {mobile, password} = req.body;
      if (password.length < 8) {
        return res
          .status(401)
          .json({message: 'Password length should be a minimum of 8 characters'});
      }
      if (!password ) {
        return res
          .status(401)
          .json({message: 'Password  do not match'});
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


  module.exports = {
    parent_register,
    login,
    forgetpassword,
    reset_password
  }