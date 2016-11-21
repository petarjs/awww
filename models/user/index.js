'use strict';

var express = require('express');
var controller = require('./user.controller');

var router = express.Router();

router.post('/subscribe', controller.subscribe);
router.get('/confirm', controller.confirm);
router.post('/preferences', controller.setPreferences);
router.get('/', controller.index);

module.exports = router;