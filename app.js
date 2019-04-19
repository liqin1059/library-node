
require('./lib/db');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
// var loginMiddleware = require('./middlewares/login');
// var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var booksRouter = require('./routes/books');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(loginMiddleware);

// session中间件
app.use(session({
  secret: 'secret message',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 120,
    secure: false
  }
}));

app.use(function(req, res, next){
  if (req.url === '/login') {
    // 登录的页面
    next();
  } else {
    if (req.session.name) {
      next();
    } else {
      req.session._garbage = Date();
      req.session.touch();
      console.log(req.session.name);
      res.json({
        code: '0004',
        data: null,
        desc: 'session认证失败，请重新登录'
      });
    }
  }
});

// app.use(function (req, res, next) {
//   var url = req.originalUrl;
//   if (url != "/" && undefined == req.session.user) {
//         res.send('<script>top.location.href="/";</script>'); //解决内嵌iframe时session拦截问题
//         return;
//     }
//   next();
// });

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/books', booksRouter);

//设置跨域访问
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
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
