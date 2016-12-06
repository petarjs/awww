require('dotenv').config()

var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var getUserFromUrlHash = require('./middleware/getUserFromUrlHash');
var GreetingHelper = require('./helpers/greeting-helper');
mongoose.Promise = require('bluebird');
var RateLimit = require('express-rate-limit');
var helmet = require('helmet');

mongoose.connect(process.env.MONGO_DB_URL);

var app = express();

app.enable('trust proxy');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));

app.set('view engine', '.hbs');

app.use(helmet());
app.use(new RateLimit({
  windowMs: 60*1000,
  max: 100,
  delayMs: 0
}));

// app.use(getUserFromUrlHash);

require('./routes')(app);

app.get('/', function (req, res) {
  res.render('home', {
    copyright: { year: new Date().getFullYear() },
    greeting: GreetingHelper.getRandomGreeting()
  });
});


var port = process.env.PORT || 3000;

app.listen(port);
console.log('Awww.ooo listening on port ' + port + ' !');
