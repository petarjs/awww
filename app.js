var config = require('./config');
var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var getUserFromUrlHash = require('./middleware/getUserFromUrlHash');
var GreetingHelper = require('./helpers/greeting-helper');
mongoose.Promise = require('bluebird');

mongoose.connect(config.mongoDbUrl);

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));

app.set('view engine', '.hbs');

// app.use(getUserFromUrlHash);

require('./routes')(app);

app.get('/', function (req, res) {
  res.render('home', {
    copyright: { year: new Date().getFullYear() },
    greeting: GreetingHelper.getRandomGreeting()
  });
});


var port = config.port || 3000;

app.listen(port);
console.log('Awww.ooo listening on port ' + port + ' !');