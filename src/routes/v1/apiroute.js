const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const { create, 
    login, 
    getCred, 
    generatePairingCode,
    pairChildDevice,
    forgetpassword,
    reset_password,
    createPackage,
    getPackages,
    getSubscription,
    postSubscription
 } = require('../../controllers/apicontroller');
const router = express.Router();

router.route('/create').post(create);
router.route('/login').post(login);
router.route('/getCred').get(getCred);
router.route('/generatePairingCode').post(generatePairingCode);
router.route('/pairChildDevice').post(pairChildDevice);
router.route('/forgetpassword').post(forgetpassword);
router.route('/reset_password').post(reset_password);
router.route('/createPackage').post(createPackage);
router.route('/getPackages').get(getPackages);
router.route('/getSubscription').post(getSubscription);
router.route('/postSubscription').post(postSubscription);


module.exports = router;

