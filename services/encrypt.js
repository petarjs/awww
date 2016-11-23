var key = process.env.SECRET_KEY;
var encryptor = require('simple-encryptor')(key);

module.exports = encryptor;