const express = require('express');
const router = express.Router();
const {create,login} = require('../../controllers/authenticate.controller.js');

router.post('/createUser',create );

router.post('/loginUser',login);

module.exports = router;