'use strict';

var hbs = require('express-handlebars').create();
var moment = require('moment');
var GreetingHelper = require('../../helpers/greeting-helper');
var encryptor = require('../../services/encrypt');
var sparkpost = require('../../services/sparkpost');
var Response = require('../../helpers/api-responses');
var Cuteness = require('./cuteness.model');

exports.find = find;

function find(req, res) {
  var cutenessId = req.params.id;
  res.render('cuteness', {
    copyright: { year: new Date().getFullYear() },
    greeting: GreetingHelper.getRandomGreeting(),
  });
  return;
  Cuteness
    .find({ _id: cutenessId })
    .then(function(cuteness) {
      res.render('cuteness', {
        copyright: { year: new Date().getFullYear() },
        greeting: GreetingHelper.getRandomGreeting(),
        cuteness: cuteness
      });
    })
    .catch(function(error) {
      res.render('error-404', {
        copyright: { year: new Date().getFullYear() },
        greeting: GreetingHelper.getRandomGreeting()
      });
    });
}
