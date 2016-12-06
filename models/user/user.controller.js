'use strict';

var hbs = require('express-handlebars').create();
var moment = require('moment');
var GreetingHelper = require('../../helpers/greeting-helper');
var encryptor = require('../../services/encrypt');
var sparkpost = require('../../services/sparkpost');
var Response = require('../../helpers/api-responses');
var User = require('./user.model');

exports.index = index;
exports.subscribe = subscribe;
exports.confirm = confirm;
exports.setPreferences = setPreferences;

function index(req, res) {
  User
    .find({})
    .then(function(users) {
      res.status(200).json(users);
    });
}

function subscribe(req, res) {
  var name = req.body.name;
  var email = req.body.email;

  User
    .findOne({ email: email })
    .then(function createNewUser(user) {
      return new Promise(function(resolve, reject) {
        if(user) {
          var errorText = 'That email is already taken. :(';
          res.json(Response.error(errorText));
          reject(errorText);
        } else {
          var newUser = new User({ name: name, email: email });
          newUser
            .save()
            .then(resolve)
            .catch(function userValidationError() {
              var errorText = 'Please provide valid user data.'
              res.json(Response.error(errorText));
              reject(errorText)
            });
        }
      })
    })
    .then(function sendWelcomeEmail(newUser) {
      var hash = encryptor.encrypt({
        userId: newUser._id,
        date: new Date().valueOf()
      });

      return hbs.render('views/emails/confirm.hbs', {
        name: 'Petar',
        link: process.env.DOMAIN + '/user/confirm?hash=' + hash
      }).then(function(html) {
        return sparkpost
          .send(newUser.email, {
            subject: 'Awww.ooo - Confirm the Cuteness',
            html: html
          })
          .then(function(data) {
            res.json(Response.data({ message: 'Awww yeah! Check your email to confirm the cuteness! :D' }))
          })
          .catch(function(err) {
            res.json(Response.error('Something went wrong.'))
          });
      })
    })
    .catch(function error(err) {
      console.log(err)
    })
}

function confirm(req, res) {
  var hash = req.query.hash;
  var payload = encryptor.decrypt(hash.replace(' ', '+'));

  if(!hash || !payload || !payload.userId) {
    res.render('error-404', {
      copyright: { year: new Date().getFullYear() },
      greeting: GreetingHelper.getRandomGreeting(),
    });
    return;
  }

  User
    .findOne({ _id: payload.userId })
    .then(function checkUser(user) {
      if(!user) {
        res.render('error-404', {
          copyright: { year: new Date().getFullYear() },
          greeting: GreetingHelper.getRandomGreeting()
        })
        throw Error('404')
      }

      // if(user.confirmed) {
      //   res.render('already-confirmed', {
      //     copyright: { year: new Date().getFullYear() },
      //     greeting: GreetingHelper.getRandomGreeting(),
      //     user: { name: user.name }
      //   })
      //   throw Error('already-confirmed')
      // }

      return user;
    })
    .then(function updateUser(user) {
      user.confirmed = true;
      user.login = encryptor.encrypt({ userId: user._id, date: new Date().valueOf() });
      return user.save();
    })
    .then(function addToSparkPostList(user) {
      return sparkpost
        .addToList(user)
        .then(function() {
          return user;
        })
    })
    .then(function sendFirstCuteness(user) {
      return hbs.render('views/emails/daily-cuteness.hbs', {
        name: 'Petar',
        link: process.env.DOMAIN + '/cuteness?hash=' + user.login
      }).then(function(html) {
        return sparkpost
          .send(user.email, {
            subject: 'Awww.ooo - Your first cuteness!',
            html: html
          })
          .then(function() {
            return user;
          })
      });
    })
    .then(function render(user) {
      res.render('confirmed', {
        copyright: { year: new Date().getFullYear() },
        greeting: GreetingHelper.getRandomGreeting(),
        hash: hash,
        payload: payload,
        user: { name: user.name }
      });
    })
}

function setPreferences(req, res) {
  var time = req.body.time;
  var hash = req.body.hash;
  var payload = encryptor.decrypt(hash.replace(' ', '+'));

  if(!payload.userId) {
    res.json(Response.error('Auth Error'));
    return;
  }

  if(!time) {
    res.json(Response.error('Gotta provide the time!'));
    throw Error('Time Missing Error');
  }

  User
    .findOne({ _id: payload.userId })
    .then(function updateUserPreferences(user) {
      if(!user) {
        res.json(Response.error('Auth Error'));
        throw Error('Auth Error');
      }

      user.preferences.sendTime = time;
      return user.save();
    })
    .then(function() {
      res.json(Response.data({
        message: 'Preferences updated!'
      }));
    })
}
