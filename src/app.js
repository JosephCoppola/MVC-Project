var path = require('path');
var express = require('express');
var compression = require('compression');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var url = require('url');
var csrf = require('csurf');
var config = require('./config.js');

var dbURL = process.env.MONGOLAB_URI || config.dburl;

var db = mongoose.connect(dbURL,function(err){
	if(err)
	{
		console.log("Failed to connect to database");
		throw err;
	}
});

var router = require('./router.js');

var port = config.http.port;

var app = express();

app.disable('x-powered-by');
app.use('/assets',express.static(path.resolve(config.staticAssets.path)));
app.use(compression());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(session({
		key: "sessionid",
		store: new RedisStore({
			host: config.redis.host,
			port: config.redis.port,
			pass: config.redis.pass
		}),
		secret: config.sessions.secret,
		resave: true,
		saveUninitialized: true,
		cookie:{
			httpOnly: true
		}
}));
app.set('view engine','jade');
app.set('views',__dirname + '/views');
app.use(favicon(__dirname + '/../client/img/favicon.png'));
app.use(cookieParser());

app.use(csrf());
app.use(function(err,req,res,next){
	if(err.code !== 'EBADCSRFTOKEN') return next(err);
	
	return;
});

router(app);

app.listen(port,function(err){
	if(err){
		throw err;
	}
	
	console.log('Listening on port' + port);
});