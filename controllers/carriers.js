const Carrier = require('../models/Carrier'),
	async = require('async'),
	fs = require('fs');

exports.addRoutes = function (app, config) {
	app.namespace('/api/v1/carriers', function () {

		app.get('/:id', function (req, res, next) {
			var id = req.params.id;

			Carrier.findOne({ _id: id }, function (err, carrier) {
				if (err) {
					console.log(err);
					res.json(null);
				}

				res.json(carrier);
			});
		});

		app.post('/', function (req, res) {
			var carrierData = JSON.parse(req.body.data),
				logoFile = req.files.logoFile;

			function saveLogo (logo, callback) {
				fs.readFile(logoFile.path, function (err, data) {
					var newName = (+new Date()) + '_' + logoFile.name;

					fs.writeFile(config.app.uploadedFilesRoot + '/carriersLogos/' + newName, data, function (err) {
						callback(err, '/static/img/carriersLogos/' + newName);
					});
				});
			};

			function saveData (data, callback) {
				var newCarrier = new Carrier(data);

				newCarrier.save(function (err, carrier) {
					callback(err, carrier);
				});	
			};

			if (logoFile) {
				saveLogo(logoFile, function (err, logoPath) {
					if (err) { console.log(err); }

					carrierData.logo = logoPath;

					saveData(carrierData, function (err, carrier) {
						if (err) { console.log(err); }

						res.json(carrier);
					});
				})
			}
			// TODO
			else {
				saveData()
			}
		});

		app.delete('/:id', function (req, res) {
			var id = req.params.id;

			Carrier.remove({ _id: id }, function (err) {
				if (err) {
					console.log(err);
				}

				res.json(null);
			});
		});

		app.put('/', function (req, res) {
			var carrierData = req.body,
				id = carrierData._id;

			delete carrierData._id;

			Carrier.findOneAndUpdate({ _id: id }, carrierData, function (err, carrier) {
				if (err) {
					console.log(err);
				}

				res.json(carrier);
			});
		});

		app.get('/', function (req, res) {
			var offset = req.query.offset,
				limit = req.query.limit ? req.query.limit : 9999,
				sort = req.query.sort || '_id',
				dir = req.query.dir || 'asc',
				sortObj = {};

			sortObj[sort] = dir;

			async.parallel({
				totalCount: function (callback) {
					Carrier
						.find({})
						.count(function (err, count) {
							callback(err, count);
						});
				},
				carriers: function (callback) {
					Carrier
						.find({})
						.limit(limit)
					    .skip(offset)
					    .sort(sortObj)
					    .exec(function (err, carriers) {
							callback(err, carriers);
						});
				}
			}, function (err, result) {
				if (err) {
					return console.log(err);
				}

				var metadata = {
					totalCount: result.totalCount
				};

				res.json({
					items: result.carriers,
					metadata: metadata
				});
			});	
		});
	});
};