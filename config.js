path = require('path');

module.exports = {
	mongo: {
		devUrl: 'mongodb://localhost/dp',
		distUrl: 'mongodb://test:12345@paulo.mongohq.com:10029/DP'
	},
	server: {
		listenPort: 9000,
		distFolder: __dirname + '/dist',
		appFolder: __dirname + '/public',
		staticUrl: '/static',
		secret: 'leteckaspolecnost'
	}
};