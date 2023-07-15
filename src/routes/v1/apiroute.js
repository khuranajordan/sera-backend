const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const { create, login, getCred } = require('../../controllers/apicontroller');

const router = express.Router();

router.route('/create').post(create);

router.route('/login').post(login);
router.route('/getCred').get(getCred);

module.exports = router;

