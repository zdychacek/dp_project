require('express-namespace');

const express = require('express'),
	Resource = require('express-resource'),
	app = express(),
	mongoose = require('mongoose'),
	fs = require('fs'),
	// MOCK
	security = require('./lib/security.js'),
	config = require('./config.js');

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

// -------------- Security routes
require('./controllers/security').addRoutes(app, security);

// Mapovani na controllery
//app.resource('blogposts', require('./controllers/blogposts'), { base: '/api/v1/' });
require('./controllers/users').addRoutes(app, config);
require('./controllers/carriers').addRoutes(app, config);
require('./controllers/flights').addRoutes(app, config);

// pro podporu HTML5 location api
app.all('/*', function(req, res) {
	res.sendfile('index.html', { root: config.server.appFolder });
});

app.use(function (req, res, next) {
	res.status(404);

	if (req.accepts('json')) {
		return res.send({ error: 'Not found' });
	}

	// default to plain-text. send()
	res.type('txt').send('Not found');
});

app.listen(config.server.listenPort);
console.log('Express started on port ' + config.server.listenPort);