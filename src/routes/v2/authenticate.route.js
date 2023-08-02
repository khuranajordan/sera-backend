const express = require('express');
const router = express.Router();
const {parent_register,
    login,
    forgetpassword,
    reset_password

} = require('../../controllerv2/authenticate.controller.js');

router.post('/parent_register',parent_register );

router.post('/loginUser',login);

router.post('/forgetpassword',forgetpassword);


router.post('/reset_password',reset_password);


module.exports = router;