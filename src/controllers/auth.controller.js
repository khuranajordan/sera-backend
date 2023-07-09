const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {
  authService,
  userService,
  tokenService,
  emailService,
} = require('../services');
const {User} = require('../models');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({user, tokens});
});

const login = catchAsync(async (req, res) => {
  const {mobile, password} = req.body;
  const user = await authService.loginUserWithMobileAndPassword(
    mobile,
    password,
  );
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({user, tokens});
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const getUserPasscode = catchAsync(async (req, res) => {
  const passcode = req.params.passcode;

  try {
    const user = await User.findOne({passcode});

    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }
    const tokens = await tokenService.generateAuthTokens(user);
    res.send({user, tokens});
  } catch (error) {
    res.status(500).json({error: 'Internal server error'});
  }
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({...tokens});
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email,
  );
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    req.user,
  );
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  getUserPasscode,
};
