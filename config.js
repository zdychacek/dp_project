path = require('path');

module.exports = {
	mongo: {
		devUrl: 'mongodb://test:12345@paulo.mongohq.com:10021/MyRemoteDB',
		distUrl: 'mongodb://test:12345@paulo.mongohq.com:10021/MyRemoteDB'
	},
	server: {
		listenPort: 9000,                                   // The port on which the server is to listen (means that the app is at http://localhost:3000 for instance)
		distFolder: __dirname + '/dist',
		appFolder: __dirname + '/public',
		staticUrl: '/static',
		secret: 'angular-app'
	}
};