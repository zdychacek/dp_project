exports.addRoutes = function (app, security) {
	app.namespace('/api/v1/security', function () {

		app.post('/login', security.login);

		app.post('/logout', security.logout);

		app.get('/current-user', security.sendCurrentUser);

		app.get('/authenticated-user', function (req, res) {
			security.authenticationRequired(req, res, function () {
				security.sendCurrentUser(req, res);
			});
		});

		app.get('/admin-user', function (req, res) {
			security.adminRequired(req, res, function () {
				security.sendCurrentUser(req, res);
			});
		});
	});
};
