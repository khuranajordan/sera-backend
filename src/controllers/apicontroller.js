const {json} = require('express');
const {User} = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
    const {name, email, password, confirmPassword, userisparent, mobile} =
      req.body;

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !userisparent ||
      !mobile
    ) {
      return res.status(400).json({message: 'All fields are required'});
    }
    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({message: 'Passwords do not match'});
    }

    var user = await User.create({
      name,
      email,
      password,
      confirmPassword,
      userisparent,
      mobile,
    });

    var token = await jwt.sign(user.id, 'abcdefghijklmn');

    user = user.toJSON();
    user.token = token;
    return res.status(200).json({message: 'User created successfully', user});
  } catch (error) {
    console.log(error.message, 'error');
    return res.status(404).json(error.message);
  }
};

const login = async (req, res) => {
  try {
    let {mobile, userisparent, password} = req.body;
    var data = await User.findOne({mobile});
    if (!data) {
      return res.status(202).json({message: 'mobile number is not found'});
    }

    if (!data || !(await data.isPasswordMatch(password))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'password does not match');
    }

    let token = await jwt.sign(data.id, 'abcdefghijklmn');
    token = token.token;
    data = data.toJSON();
    data.token = token;
    return res.status(200).json({message: 'login successfully', data});
  } catch (error) {
    console.log(error.message, 'in catch');
    return res.status(400).json(error.message);
  }
};

module.exports = {
  create,
  login,
};
