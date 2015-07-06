var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'app'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app')));

app.get('/browserUpgrade', function (req, res) {
    res.sendfile('app/browserUpgrade.html');
});

app.post('/submitLinkInfo', function (req, res) {
	console.log("started.");
	var project = req.body.projectId;
	var linkInfo = req.body.linkInfo;
	var filename = req.body.fileName;
	var To = req.body.mailTo;
	var Cc = req.body.mailCc;
	var filePath = "d:\\testfolder\\"+project+"\\";
	var absoluteFilePath = "\\\\cvslink.premiumit-cn.com\\Project_Issues_List\\"+project+"\\";
	var fullFileName = filePath+filename;
	
	fs.writeFile(fullFileName , linkInfo, encoding='utf8', function(err){
		if (err) throw err;
		console.log("Link file wrote successfully: "+ fullFileName);
		res.send({'absoluteFilePath': absoluteFilePath+filename});
	});
	
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.get('/', function (req, res) {
    res.sendfile('app/index.html');
});

module.exports = app;
