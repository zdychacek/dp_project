'use strict';

var mongoose = require('mongoose'),
	config = require('./config'),
	User = require('./models/User'),
	Flight = require('./models/Flight');

function connect (env) {
	var dbUri = config.mongo.devUrl;
	env = env || '';

	if (env.indexOf('prod') > -1) {
		dbUri = config.mongo.distUrl;
	}
	mongoose.connect(dbUri);
}

module.exports = {

	insertUsers: function (env, cb) {
		connect(env);

		var users = [
			{
				login: '12345',
				password: '12345',
				isAdmin: false,
				firstName: 'John',
				lastName: 'Doe',
				email: 'john@doe.com'
			},
			{
				login: '1',
				password: '1',
				isAdmin: true,
				firstName: 'Big',
				lastName: 'Boss',
				email: 'big@boss.com'
			}
		];

		User.create(users, cb);
	},

	removeUsers: function (env, cb) {
		connect(env);

		User.remove(cb);
	},

	generateFlights: function (count, env, cb) {
		connect(env);

		Flight.generate(count, cb);
	},

	removeFlights: function (env, cb) {
		connect(env);

		Flight.remove(cb);
	}
};
