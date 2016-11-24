var _ = require('lodash');

exports.getRandomGreeting = getRandomGreeting;

var greetings = {};
greetings.words1 = ['animal', 'creature', 'pet', 'cat', 'dog', 'fauna', 'panda', 'koala', 'kangaroo', 'zoological'];
greetings.words2 = ['lover', 'connoisseur', 'appreciator', 'aficionado', 'fan', 'devotee', 'admirer', 'enthusiast', 'supporter'];

function getRandomGreeting() {
  var word1 = _.sample(greetings.words1);
  var word2 = _.sample(greetings.words2);

  return { word1: word1, word2: word2 };
}