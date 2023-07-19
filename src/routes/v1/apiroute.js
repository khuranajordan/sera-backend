const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const { create, 
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
    getAllPackages,
    deletePackageById,
    updatePackageById,
    getSubscription,
    postSubscription
 } = require('../../controllers/apicontroller');
const router = express.Router();

router.route('/createUser').post(create);
router.route('/loginUser').post(login);
router.route('/getCred').get(getCred);
router.route('/generatePairingCode').post(generatePairingCode);
router.route('/addChildApp').post(addChildApp);
router.route('/pairChildDevice').post(pairChildDevice);
router.route('/getChildData').post(getChildDataByPairingCode);
router.route('/forgetpassword').post(forgetpassword);
router.route('/reset_password').post(reset_password);
router.route('/createPackage').post(createPackage);
router.route('/filterbyPromoCode').post(filterPackagesByPromoCode);
router.route('/packages/:id').delete(deletePackageById);
router.route('/packages/:id').put(updatePackageById);
router.route('/getPackages').get(getAllPackages);
router.route('/getSubscription').post(getSubscription);
router.route('/postSubscription').post(postSubscription);

module.exports = router;