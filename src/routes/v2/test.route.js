const express = require('express');
const router = express.Router();
const {createTest,getAllTest} = require('../../controllers/test.controller.js');

router.post('/create',createTest );

router.get('/get',getAllTest);

module.exports = router;