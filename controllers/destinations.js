const Destination = require('../models/Destination');

exports.addRoutes = function (app, config) {
	app.namespace('/api/v1/destinations', function () {
		app.get('/', function (req, res) {
			var query = req.query.q;

			Destination.filter(query, function (list) {
				res.json(list);
			});
		});
	});
};