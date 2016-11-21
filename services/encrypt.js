var config = require('../config');
var key = config.secretKey;
var encryptor = require('simple-encryptor')(key);

module.exports = encryptor;