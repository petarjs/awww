'use strict';

var express = require('express');
var controller = require('./cuteness.controller');

var router = express.Router();

router.get('/:id', controller.find);

module.exports = router;