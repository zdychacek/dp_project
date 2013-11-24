const Carrier = require('../models/Carrier'),
	async = require('async'),
	fs = require('fs'),
	suspend = require('suspend');

exports.addRoutes = function (app, config, security) {
	// k nazvu souboru prida cas
	function makeFileName (fileName) {
		return (+new Date()) + '_' + fileName;
	};

	app.namespace('/api/v1/carriers', function () {

		app.get('/:id', function (req, res) {
			suspend(function* (resume) {
				try {
					yield security.isAuthorized(req, res, resume);

					res.sendData(yield Carrier.findById(req.params.id, resume));
				}
				catch (ex) {
					console.log(ex);
				}
			})();
		});

		app.post('/', function (req, res) {
			suspend(function* (resume) {
				try {
					yield security.isAdmin(req, res, resume);

					var reqBody = JSON.parse(req.body.data),
						logoFile = req.files.logoFile;

					if (logoFile) {
						var fileName = makeFileName(logoFile.name);

						var result = yield async.parallel({
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
						}, resume);

						res.sendData(result.saveData);
					}
					else {
						var carrier = new Carrier(reqBody);
						res.sendData(yield carrier.save(resume));
					}
				}
				catch (ex) {
					console.log(ex);
				}
			})();
		});

		app.delete('/:id', function (req, res) {
			suspend(function* (resume) {
				try {
					yield security.isAdmin(req, res, resume);

					var carrier = yield Carrier.findById(req.params.id, resume);

					// smazu logo
					if (carrier.logo) {
						fs.unlink(config.app.uploadedFilesRoot + '/carriersLogos/' + carrier.logo);
					}

					// odstranim z DB
					yield carrier.remove(resume);
					res.sendData(null);
				}
				catch (ex) {
					console.log(ex);
				}
			})();
		});

		app.put('/:id', function (req, res) {
			suspend(function* (resume) {
				try {
					yield security.isAdmin(req, res, resume);

					var logoFile = req.files.logoFile,
						carrier = yield Carrier.findById(req.params.id, resume),
						reqBody = JSON.parse(req.body.data);

					carrier.name = reqBody.name;
					carrier.disabled = reqBody.disabled;

					if (logoFile) {
						var fileName = makeFileName(logoFile.name),
							result = yield async.parallel({
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
							}, resume);

						res.sendData(result.saveData);
					}
					else {
						if (reqBody.logo) {
							fs.unlink(config.app.uploadedFilesRoot + '/carriersLogos/' + carrier.logo);
							carrier.logo = '';
						}

						res.sendData(yield carrier.save(resume));
					}
				}
				catch (ex) {
					console.log(ex);
				}
			})();
		});

		app.get('/', function (req, res) {
			suspend(function* (resume) {
				try {
					yield security.isAuthorized(req, res, resume);

					var offset = req.query.offset,
						limit = req.query.limit,
						sort = req.query.sort,
						dir = req.query.dir;

					var result = yield async.parallel({
						totalCount: function (callback) {
							Carrier.find({}).count(callback);
						},
						carriers: function (callback) {
							var query = Carrier.find({});

							if (limit) {
								query.limit(limit);
							}

							if (offset) {
							    query.skip(offset);
							}

							if (sort && dir) {
								var sortObj = {};
								sortObj[sort] = dir;

								query.sort(sortObj);
							}

						    query.exec(callback);
						}
					}, resume);

					res.sendData({
						items: result.carriers,
						metadata: {
							totalCount: result.totalCount
						}
					});
				}
				catch (ex) {
					console.log(ex);
				}
			})();
		});
	});
};
