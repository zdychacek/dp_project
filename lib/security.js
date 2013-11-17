var filterUser = function (user) {
	if (user) {
		return {
			user: user
		};
	}
	else {
		return { user: null };
	}
};

var security = {
	authenticationRequired: function (req, res, next) {
		console.log('authRequired');

		if (req.session.user) {
			next();
		}
		else {
			res.json(401, filterUser(req.session.user));
		}
	},

	adminRequired: function (req, res, next) {
		console.log('adminRequired');

		if (req.session.user && req.session.user.admin) {
			next();
		}
		else {
			res.json(401, filterUser(req.session.user));
		}
	},

	sendCurrentUser: function (req, res, next) {
		res.json(200, filterUser(req.session.user));
		res.end();
	},

	login: function (req, res, next) {
		var loginData = req.body;

		if (loginData.email == 'admin' && loginData.password == '12345') {
			req.session.user = {
				id: 1,
				email: 'admin@admin.cz',
				firstName: 'Admin',
				lastName: 'Adminovic',
				admin: true
			};

			res.json(200, filterUser(req.session.user));
		}
		else if (loginData.email == 'test' && loginData.password == '12345') {
			req.session.user = {
				id: 1,
				email: 'users@user.cz',
				firstName: 'User',
				lastName: 'Userovic',
				admin: false
			};

			res.json(200, filterUser(req.session.user));
		}
		else {
			res.json(200, filterUser(req.session.user));
		}
	},

	logout: function (req, res, next) {
		if (req.session.user) {
			req.session.user = null;
		}

		res.send(204);
	}
};

module.exports = security;
