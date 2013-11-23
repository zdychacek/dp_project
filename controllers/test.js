const Json2Xml = require('../lib/Json2Xml');

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

			res.header('Content-Type', 'text/xml');

			var xml = Json2Xml.toXml(obj);
			res.send(xml);
		});
	});
};