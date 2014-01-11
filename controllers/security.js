exports.addRoutes = function (app, security) {
	//app.namespace('/api/v1/security', function () {

		app.post('/api/v1/security/login', security.login);

		app.post('/api/v1/security/logout', security.logout);

		app.get('/api/v1/security/current-user', security.sendCurrentUser);

		app.get('/api/v1/security/authenticated-user', function (req, res) {
			security.authenticationRequired(req, res, function () {
				security.sendCurrentUser(req, res);
			});
		});

		app.get('/api/v1/security/admin-user', function (req, res) {
			security.adminRequired(req, res, function () {
				security.sendCurrentUser(req, res);
			});
		});
	//});
};
