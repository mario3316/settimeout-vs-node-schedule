var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var heapdump = require('heapdump');
const schedule = require('node-schedule');
const moment = require('moment');

var memoryLeak = [];

function LeakedObject(){ };

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//Settimeout 실험 코드
const startSettimeout = () => {
  for(var i=0; i<100000; i++){
    const date = moment().add(500, 'ms').toDate();

    setTimeout(function() {
      console.log('making memory leak. Current memory usage :' + (process.memoryUsage().rss / 1024 / 1024) + 'MB');
    }, 500);
  }

  console.log('생성 완료');
}

//node-schedule 실험 코드
const startSchedule = () => {

  for(var i=0; i<100000; i++){
    const date = moment().add(500, 'ms').toDate();

    schedule.scheduleJob(date, function(){
      console.log('making memory leak. Current memory usage :' + (process.memoryUsage().rss / 1024 / 1024) + 'MB');
    });
  }

  console.log('생성 완료');
}

app.use('/start',function(req,res,next){
  // startSettimeout();
  startSchedule();

  res.send('Started making setTimeOuts()');
});

app.use('/leak',function(req,res,next){
  console.log('making memory leak. Current memory usage :' + (process.memoryUsage().rss / 1024 / 1024) + 'MB');
  res.send('making memory leak. Current memory usage :' + (process.memoryUsage().rss / 1024 / 1024) + 'MB');
});

app.use('/heapdump',function(req,res,next){
  var filename = '/' + Date.now() + '.heapsnapshot';
  heapdump.writeSnapshot(filename);
  res.send('Heapdump has been generated in '+filename);
});

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
