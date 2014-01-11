const logger = require('koa-logger'),
	send = require('koa-send'),
	//route = require('koa-route'),
	favicon = require('koa-favicon'),
	session = require('koa-session'),
	serve = require('koa-static'),
	compress = require('koa-compress'),
	views = require('co-views'),
	koa = require('koa'),
	app = koa(),
	mongoose = require('mongoose'),
	fs = require('fs'),
	security = require('./lib/security'),
	config = require('./config'),
	Json2Xml = require('./lib/Json2Xml');

/*io.on('connect', function () {
	console.log('client has been connected...');
});*/

// Pripojeni k DB
mongoose.connect(config.mongo.devUrl, function (err) {
	if (err) {
		console.log(err);
	}
});

app.keys = ['some secret hurr'];

app.use(logger());
app.use(favicon());
app.use(session());
app.use(compress());
app.use(require('koa-trie-router')(app));

app.use(function *() {
	// TODO: pouzit static middleware ??
	if (this.originalUrl.indexOf('/static/') == 0) {
		yield send(this, __dirname + this.originalUrl);
	}
	// pro podporu HTML5 location api
	else {
		yield send(this, __dirname + '/static/index.html');
	}
});

// Mapovani na controllery
require('./controllers/security').addRoutes(app, security);
/*require('./controllers/users').addRoutes(app, config, security);
require('./controllers/carriers').addRoutes(app, config, security);
require('./controllers/flights').addRoutes(app, config, security, io);
require('./controllers/destinations').addRoutes(app, config, security);
require('./controllers/test').addRoutes(app, config, security);*/

app.on('error', function (err, ctx){
 	console.log('server error', err, ctx);
});

app.listen(process.env.PORT);
console.log('Koa started on port ' + process.env.PORT);
