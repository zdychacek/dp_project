require('express-namespace');

const express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	fs = require('fs'),
	security = require('./lib/security'),
	config = require('./config'),
	Json2Xml = require('./lib/Json2Xml'),
	server = require('http').createServer(app),
	vxml = require('./lib/vxml'),
	io = require('socket.io').listen(server);

io.on('connect', function () {
	console.log('client has been connected...');
});

if (process.env.NODE_ENV === 'production' || process.argv[2] === 'production') {
	app.set('db uri', config.mongo.distUrl);
	app.set('env', 'production');
}

if (app.get('env') === 'development') {
	app.set('db uri', config.mongo.devUrl);
	app.use(express.logger('dev'));
}

// Pripojeni k DB
mongoose.connect(app.get('db uri'), function (err) {
	if (err) {
		console.log(err);
	}
});

app.use(function (req, res, next) {
	res.sendData = function (objOrCode, data) {
		var format = req.query.format || 'json',
				obj,
				statusCode = 200;

		if (arguments.length == 2) {
			statusCode = objOrCode;
			obj = data;
		}
		else {
			obj = objOrCode;
		}

		if (format == 'json') {
			res.header('Content-Type', 'application/json');
			res.send(statusCode, obj);
		}
		else if (format == 'xml') {
			res.header('Content-Type', 'text/xml');
			res.send(statusCode, Json2Xml.toXml(obj));
		}
		else {
			res.send(406);
		}
	};

	next();
});

app.use(express.favicon());
app.use(express.cookieParser(config.server.secret));
app.use(express.session({
	secret: config.server.secret
}));
app.use(express.bodyParser());
app.use(express.compress());
app.use(express.methodOverride());

if (app.get('env') === 'production') {
	app.disable('verbose errors');
}

// -------------- Staticke soubory
if (app.get('env') === 'development') {
	console.log(config.server.staticUrl, config.server.appFolder);
	app.use(config.server.staticUrl, express.static(config.server.appFolder));

} else {
	app.use(config.server.staticUrl, express.static(config.server.distFolder));
}

app.use(config.server.staticUrl, function (req, res, next) {
	res.send(404);
});

// Mapovani na controllery
require('./controllers/security').addRoutes(app, security);
require('./controllers/users').addRoutes(app, config, security);
require('./controllers/carriers').addRoutes(app, config, security);
require('./controllers/flights').addRoutes(app, config, security, io);
require('./controllers/destinations').addRoutes(app, config, security);
require('./controllers/test').addRoutes(app, config, security);

// vytvoreni VXML aplikace
vxml.Application.create({
	server: app,
	route: '/vxml',
	controller: require('./voicePortal')
});

// pro podporu HTML5 location api
app.all('/*', function(req, res) {
	res.sendfile('index.html', { root: config.server.appFolder });
});

app.use(express.errorHandler({
	dumpExceptions: true,
	showStack: true
}));

server.listen(process.env.PORT);
console.log('Express started on port ' + process.env.PORT);
