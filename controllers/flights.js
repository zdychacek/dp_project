const Flight = require('../models/Flight'),
	PathPart = require('../models/PathPart'),
	suspend = require('suspend');

exports.addRoutes = function (app, config, security, io) {
	app.namespace('/api/v1/flights', function () {

		app.get('/generate/:count', function (req, res) {
			Flight.generate(count);
			res.json(null);
		});

		app.get('/:id/make-reservation', function (req, res) {
			suspend(function* (resume) {
				try {
					var user = yield security.isAuthorized(req, res, resume),
						flight = yield Flight.findById(req.params.id, resume);

					flight = yield flight.addReservationForUser(user, resume);
					flight = flight.serializeWithContext(user);

					io.sockets.emit('flight:changed', flight);
				}
				catch (ex) {
					flight._errors_ = [{
						type: 'error',
						message: ex
					}];
				}
				finally {
					res.json(flight);
				}
			})();
		});

		app.get('/:id/cancel-reservation', function (req, res) {
			suspend(function* (resume) {
				try {
					var user = yield security.isAuthorized(req, res, resume),
						flight = yield Flight.findById(req.params.id, resume);

					flight = yield flight.cancelReservationForUser(user, resume);
					flight = flight.serializeWithContext(user);

					io.sockets.emit('flight:changed', flight);
				}
				catch (ex) {
					flight._errors_ = [{
						type: 'error',
						message: ex
					}];
				}
				finally {
					res.json(flight);
				}
			})();
		});

		app.get('/delete', function (req, res) {
			suspend(function* (resume) {
				try {
					var user = yield security.isAdmin(req, res, resume);
					yield Flight.remove({}, remove);

					res.send(null);
				}
				catch (ex) {
					console.log(ex);
				}
			});
		});

		app.get('/:id', function (req, res) {
			suspend(function* (resume) {
				try {
					var user = yield security.isAuthorized(req, res, resume),
						flight = yield Flight.findById(req.params.id, resume);

					res.json(flight.serializeWithContext(user));
				}
				catch (ex) {
					console.log(ex);
				}
			})();
		});

		app.post('/', function (req, res) {
			suspend(function* (resume) {
				try {
					var user = yield security.isAdmin(req, res, resume),
						flight = new Flight(req.body);

					flight = yield flight.save(resume);
					flight = flight.serializeWithContext(user);

					io.sockets.emit('flight:created', flight);
					res.json(flight);
				}
				catch (ex) {
					console.log(ex);
				}
			})();
		});

		app.delete('/:id', function (req, res) {
			suspend(function* (resume) {
				try {
					var user = yield security.isAdmin(req, res, resume);
					yield Flight.remove({ _id: req.params.id }, resume);

					io.sockets.emit('flight:deleted', req.params.id);
					res.json(null);
				}
				catch (ex) {
					console.log(ex);
				}
			})();
		});

		app.put('/:id', function (req, res) {
			suspend(function* (resume) {
				try {
					var user = yield security.isAdmin(req, res, resume),
						flight = yield Flight.findById(req.params.id, resume);

					flight.date = req.body.date;
					flight.price = req.body.price;
					flight.capacity = req.body.capacity;
					flight.note = req.body.note;
					flight.path = req.body.path;

					flight = yield flight.save(resume);
					flight = flight.serializeWithContext(user);

					io.sockets.emit('flight:changed', flight);
					res.json(flight);
				}
				catch (ex) {
					console.log(ex);
				}
			})();
		});

		app.get('/', function (req, res) {
			suspend(function* (resume) {
				try {
					var filter = {},
						user = yield security.isAuthorized(req, res, resume);

					if (req.query.filter) {
						filter = JSON.parse(req.query.filter);
					}

					if (filter.onlyMyReservation) {
						filter.userId = user._id;
					}

					var result = yield Flight.filter(filter, req.query, resume);

					result.items = (result.items || []).map(function (flight) {
						return flight.serializeWithContext(user);
					})
					res.json(result);
				}
				catch (ex) {
					console.log(ex);
				}
			})();
		});
	});
};
