var Json2Xml = {};

Json2Xml.config = {
	rootElement: 'response'
};

function _traverse (objOrArray, elements) {
	if (Array.isArray(objOrArray)) {
		for (var i = 0, l = objOrArray.length; i < l; i++) {
			_traverse(objOrArray, elements);
		}
	}
	else {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				_traverse(objOrArray, elements);
			}
		}
	}
};

Json2Xml.toXml = function (obj) {
	var elements = [];

	elements.push({
		tag: Json2Xml.config.rootElement,
		attributes: [],
		children: []
	});

	_traverse(obj, elements);

	return elements;
};

module.exports = Json2Xml;