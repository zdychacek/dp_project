const path = require('path');

module.exports = {
	mongo: {
		//devUrl: 'mongodb://localhost/dp',
		devUrl: 'mongodb://test:12345@paulo.mongohq.com:10029/DP',
		distUrl: 'mongodb://test:12345@paulo.mongohq.com:10029/DP'
	},
	server: {
		distFolder: __dirname + '/dist',
		appFolder: __dirname + '/public',
		staticUrl: '/static',
		secret: 'leteckaspolecnost'
	},
	app: {
		uploadedFilesRoot: __dirname + '/public/img'
	}
};
