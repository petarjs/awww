'use strict';

module.exports = function(app) {

  // app.use('/api/cuteness', require('./api/cuteness'));
  app.use('/user', require('./models/user'));

};
