'use strict';

exports.addRoutes = function (app, config, security) {
	app.namespace('/api/v1/test', function () {
		app.get('/', function (req, res) {
			var obj = {
				firstName: 'ondrej',
				lastName: 'zdych',
				age: 25,
				list: [
					{
						name: 'test 1',
						huhu: 'huhu'
					},
					{
						name: 'test 2',
						huhu: 'hehe'
					}
				]
			};

			res.sendData(obj);
		});
	});
};
