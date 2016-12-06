var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGO_DB_URL);

// var animalSeeder = require('./api/animal/animal.seed');
var cutenessSeeder = require('./api/cuteness/cuteness.seed');
var userSeeder = require('./api/user/user.seed');

start()
  .then(userSeeder)
  .then(cutenessSeeder)
  .then(function() {
    console.log('Seeders complete.');
  });

function start() {
  return new Promise(function(resolve) {
    console.log('Starting seeders!');
    resolve()
  });
}