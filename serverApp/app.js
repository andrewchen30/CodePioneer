var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//debug
var debug = require('debug')('app.js');

//entry
var routes = require('./routes/index');

//API
var users = require('./routes/api-user');
var article = require('./routes/api-like');
var articles = require('./routes/api-article');
var follow = require('./routes/api-follow');
var classify = require('./routes/api-classify-article');

//feature modules
var crawl = require('./feature/crawl.js');
var testCrawlAPI = require('./feature/test-CrawlAPI.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//set haeder
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
});

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //讓req.body可以在JSON內傳送Array
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//router
app.use('/', routes);
app.use('/api/users', users);
app.use('/api/like', article);
app.use('/api/article', articles);
app.use('/api/follow', follow);
app.use('/api/classify-article', classify);

//test, need to remove
app.use('/api/testCrawlAPI', testCrawlAPI);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

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



var port = 8080;

app.listen(port, function(){

    console.log('[Server] started -> http://localhost:' + port);

    let User = require('./models/user.js');

    let user = new User({
        name: '測試人員',
        email: '123',
        pwd: '123',
        likeArticle: [],
        whoLikeMe: [],
    });

    User.removeAsync({})
        .then( () => {
            return user.saveAsync()
        })
        .spread( (result) => {
            debug('[POST] 新增使用者 success ->', result);
        })
        .catch( (err) => {
            debug('[POST] 新增使用者 fail ->', err);
        });

    //crawl api
    //==========================================

    // var crawltick = new crawl();
    // crawltick.start();

});

module.exports = app;
