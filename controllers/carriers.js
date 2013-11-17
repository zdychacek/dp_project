const Carrier = require('../models/Carrier'),
	async = require('async'),
	fs = require('fs');

exports.addRoutes = function (app, config) {
	// k nazvu souboru prida cas
	function makeFileName (fileName) {
		return (+new Date()) + '_' + fileName;
	};

	app.namespace('/api/v1/carriers', function () {

		app.get('/:id', function (req, res) {
			Carrier.findById(req.params.id, function (err, carrier) {
				if (!err) {
					res.json(carrier);

				}
				else {
					console.log(err);
					res.json(null);
				}
			});
		});

		app.post('/', function (req, res) {
			var reqBody = JSON.parse(req.body.data),
				logoFile = req.files.logoFile;

			if (logoFile) {
				var fileName = makeFileName(logoFile.name);

				async.parallel({
					saveLogo: function (callback) {
						fs.readFile(logoFile.path, function (err, data) {
							fs.writeFile(config.app.uploadedFilesRoot + '/carriersLogos/' + fileName, data, callback);
						});
					},
					saveData: function (callback) {
						var carrier = new Carrier(reqBody);
						carrier.logo = fileName;
						carrier.save(function (err, carrier) {
							callback(err, carrier);
						});
					}
				}, function (err, result) {
					if (!err) {
						res.json(result.saveData);
					}
					else { console.log(err); }
				});
			}
			else {
				var carrier = new Carrier(reqBody);
				carrier.save(function (err, carrier) {
					if (!err) {
						res.json(carrier);
					}
					else { console.log(err); }
				});
			}
		});

		app.delete('/:id', function (req, res) {
			Carrier.findById(req.params.id, function (err, carrier) {
				if (!err) {
					// smazu logo
					if (carrier.logo) {
						fs.unlink(config.app.uploadedFilesRoot + '/carriersLogos/' + carrier.logo);
					}

					// odstranim z DB
					carrier.remove(function (err) {
						if (!err) {
							res.json(null);
						}
						else { console.log(err); }
					})
				}
				else { console.log(err); }
			});
		});

		app.put('/:id', function (req, res) {
			var logoFile = req.files.logoFile;

			Carrier.findById(req.params.id, function (err, carrier) {
				if (!err) {
					var reqBody = JSON.parse(req.body.data);

					carrier.name = reqBody.name;
					carrier.disabled = reqBody.disabled;

					if (logoFile) {
						var fileName = makeFileName(logoFile.name);

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
							else { console.log(err); }
						});
					}
					else {
						if (reqBody.logo === '') {
							fs.unlink(config.app.uploadedFilesRoot + '/carriersLogos/' + carrier.logo);
							carrier.logo = '';
						}

						carrier.save(function (err, carrier) {
							if (!err) {
								res.json(carrier);
							}
							else { console.log(err); }
						});
					}
				}
				else { console.log(err); }
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
				data: function (callback) {
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
				if (!err) {
					res.json({
						items: result.data,
						metadata: {
							totalCount: result.totalCount
						}
					});
				}
				else { return console.log(err); }
			});
		});
	});
};
