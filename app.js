var createError = require('http-errors');
var express = require('express');
const cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Define Routers
var indexRouter = require('./app_server/routes/index');
var usersRouter = require('./app_server/routes/users');
var travelRouter = require('./app_server/routes/travel');
var apiRouter = require('./app_api/routes/index');

var handlebars = require('hbs');

// Bring in the database
require('./app_api/models/db');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));

// register handlebars partials
handlebars.registerPartials(__dirname + '/app_server/views/partials');

app.set('view engine', 'hbs');

// app.use(cors({
//   origin: 'http://localhost:4200'
// }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Enable Cors
// app.use('/api', (req, res, next) => {
//   res.header('Access-control-Allow-Origin', 'http://localhost:4200');
//   res.header('Access-control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization');
//   res.header('Access-control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   next();
// })

// More proper usage of cors
app.use(cors({
  origin: 'http://localhost:4200', // Ensure there's no typo in the URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// You can still use specific CORS rules for /api if needed
app.use('/api', cors(), (req, res, next) => {
  next();
});

// Wire-up routes to controllers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/travel', travelRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
