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
			var reqBody = JSON.parse(req.body.data),
				logoFile = req.files.logoFile;

			if (logoFile) {
				var fileName = (+new Date()) + '_' + logoFile.name;

				async.parallel({
					saveLogo: function (callback) {
						fs.readFile(logoFile.path, function (err, data) {
							fs.writeFile(config.app.uploadedFilesRoot + '/carriersLogos/' + fileName, data, callback);
						});
					},
					saveData: function (callback) {
						var newCarrier = new Carrier(reqBody);
						newCarrier.logo = fileName;

						newCarrier.save(callback);	
					}
				}, function (err, result) {
					if (!err) {
						res.json(result.saveData);
					}
					else {
						console.log(err);
					}
				});
			}
			else {
				var newCarrier = new Carrier(reqBody);
				newCarrier.save(function (err, carrier) {
					if (!err) {
						res.json(carrier);
					}
					else {
						console.log(err);
					}
				});
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

		// TODO: refactor s metodou app.post('/',...)
		app.put('/:id', function (req, res) {
			var logoFile = req.files.logoFile;

			Carrier.findById(req.params.id, function (err, carrier) {
				var reqBody = JSON.parse(req.body.data);

				carrier.name = reqBody.name;
				carrier.disabled = reqBody.disabled;

				if (logoFile) {
					var fileName = (+new Date()) + '_' + logoFile.name;

					async.parallel({
						saveLogo: function (callback) {
							fs.readFile(logoFile.path, function (err, data) {
								fs.writeFile(config.app.uploadedFilesRoot + '/carriersLogos/' + fileName, data, callback);
							});
						},
						saveData: function (callback) {
							carrier.logo = fileName;
							carrier.save(function (err, carrier) {
								callback(err, carrier);
							});
						}
					}, function (err, result) {
						if (!err) {
							res.json(result.saveData);
						}
						else {
							console.log(err);
						}
					});
				}
				else {
					if (reqBody.logo === '') {
						carrier.logo = '';
					}
					
					carrier.save(function (err, carrier) {
						if (!err) {
							res.json(carrier);
						}
						else {
							console.log(err);
						}
					});
				}
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