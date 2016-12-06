'use strict';

module.exports = function(app) {

  app.use('/user', require('./models/user'));
  app.use('/cuteness', require('./models/cuteness'));

};
