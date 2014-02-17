require('express-namespace');

const express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	fs = require('fs'),
	security = require('./lib/security'),
	config = require('./config'),
	Json2Xml = require('./lib/Json2Xml'),
	server = require('http').createServer(app),
	vxml = require('vxml'),
	io = require('socket.io').listen(server, { log: false });

if (process.env.NODE_ENV === 'production' || process.argv[2] === 'production') {
	app.set('db uri', config.mongo.distUrl);
	app.set('env', 'production');
}

if (app.get('env') === 'development') {
	app.set('db uri', config.mongo.devUrl);
	app.use(express.logger('dev'));
}

// DB connection
mongoose.connect(app.get('db uri'), function (err) {
	if (err) {
		console.log(err);
	}
});

// Data serialization in XML or JSON format
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
app.use(express.session({ secret: config.server.secret }));
app.use(express.bodyParser());
app.use(express.compress());
app.use(express.methodOverride());

// Static assets
if (app.get('env') === 'development') {
	app.use(config.server.staticUrl, express.static(config.server.appFolder));
} else {
	app.use(config.server.staticUrl, express.static(config.server.distFolder));
}

app.use(config.server.staticUrl, function (req, res, next) {
	res.send(404);
});

// Controllers routes mapping
require('./controllers/security').addRoutes(app, security);
require('./controllers/users').addRoutes(app, config, security);
require('./controllers/carriers').addRoutes(app, config, security);
require('./controllers/flights').addRoutes(app, config, security, io);
require('./controllers/destinations').addRoutes(app, config, security);
require('./controllers/test').addRoutes(app, config, security);

// VXML application creation
vxml.Application.create({
	server: app,
	route: '/vxml',
	controller: require('./voicePortal'),
	config: {
		// reference to socket.io for notyfing web application
		io: io
	}
});

// Test VXML application creation
vxml.Application.create({
	server: app,
	route: '/test',
	controller: require('./test'),
	config: {
		// reference to socket.io for notyfing web application
		io: io
	}
});

// For HTML5 history api support
app.all('/*', function (req, res) {
	res.sendfile('index.html', { root: config.server.appFolder });
});

// Nice 500
app.use(express.errorHandler({
	dumpExceptions: true,
	showStack: true
}));

// Start server
server.listen(process.env.PORT);
console.log('Express started on port ', process.env.PORT);
