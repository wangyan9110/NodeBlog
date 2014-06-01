
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes/index');
var http = require('http');
var path = require('path');
var config=require('./config');
var posts=require('./routes/posts');
var errorInterceptor = require('./common/InfoInterceptor');
var userInterceptor=require('./common/UserInterceptor');
var dateExt=require('./common/DateExt');
var createDomain = require('domain').create;
var bizError=require('./common/BlogError').BizError;

var app = express();

var flash = require('connect-flash');
app.use(flash());

// all environments
app.set('port', process.env.PORT || config.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(function(req,res,next){
    var domain=createDomain();
    domain.on('error',function(err){
        console.error(err);
        if(err instanceof  bizError){
            req.session.error=err.message;
            return res.redirect('/');
        }else{
            res.statusCode = 500;
            res.end(err.message + '\n');
        }
        domain.dispose();
    });
    domain.enter();
    next();
});
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('myblogs'));
app.use(express.session());
app.use(errorInterceptor());
app.use(userInterceptor());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//设置全局地址
global.ROOT='http://localhost:3000';
//执行日期扩展方法
dateExt();

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/',posts.list);
app.get('/login',routes.login);
app.post('/login',routes.loginAction);
app.get('/posts/edit',posts.edit);
app.post('/posts/edit',posts.editAction);
app.get('/posts/list/:pageIndex?',posts.list);
app.get('/posts/:url',posts.get);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
