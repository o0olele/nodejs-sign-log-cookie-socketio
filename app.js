var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var moment = require('moment');

var indexRouter = require('./routes/index');
var signRouter = require('./routes/sign');
var homeRouter = require('./routes/home');
var quesRouter = require('./routes/ques');
var chatRouter = require('./routes/chat');
var outRouter = require('./routes/logout');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/sign', signRouter);
app.use('/home', homeRouter);
app.use('/ques', quesRouter);
app.use('/chat', chatRouter);
app.use('/logout', outRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
});

var server = app.listen(8081, function () {
  console.log("Server Start!");
});

var count = 0;
var totalCount = 0;
var allMem = new Array();

var io = require('socket.io')(server);

io.on('connection', function (socket) {
  console.log("New Socket!");

  console.log("当前有用户连接");
  count++;
  totalCount++;
  console.log("count:" + count);

  let name = '';

  // 加入群聊
  socket.on("join", function (message) {
    console.log(message);
    name = message.name;
    console.log(name + "加入了群聊");

    if (allMem.indexOf(message.name) < 0)
      allMem.push(message.name);

    // 给公众发消息
    socket.broadcast.emit("joinNoticeOther", {
      name: name,
      action: "加入了群聊",
      count: count
    });

    // 给自己发消息
    socket.emit("joinNoticeSelf", {
      count: count,
      id: totalCount,
      all: allMem
    });


  });

  // 接收客户端所发送的信息
  socket.on("message", function (message) {
    console.log(message);
    message.date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    // 向所有客户端广播发布的消息
    io.emit("message", message);
  });

  //	 监听到连接断开
  socket.on("disconnect", function () {
    count--;
    console.log(name + "离开了群聊")
    io.emit("disconnection", {
      count: count,
      name: name
    });
  });



});

module.exports = app;
