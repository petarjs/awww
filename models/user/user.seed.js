var User = require('./user.model');

function seed() {
  var user = new User({
    name: 'Petar',
    email: 'petar@petar.io',
    unlocked: []
  });

  return user
    .save()
    .then(function() { console.log('User saved.') });
}

module.exports = seed;