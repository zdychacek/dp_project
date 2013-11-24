var Json2Xml = {};

Json2Xml.config = {
	rootElement: 'response',
	collectionItemTagName: 'item'
};

function Element (nodeName, attributes, children, textContent) {
	this._nodeName = nodeName;
	this._attributes = attributes || [];
	this._children = children || [];
	this._textContent = textContent || '';
};

Element.prototype.setNodeName = function (name) {
	this._nodeName = name;
};

Element.prototype.setTextContent = function (textContent) {
	this._textContent = textContent;
};

Element.prototype.toXml = function () {
	var str = ['<', this._nodeName];

	if (this._attributes.length) {
		str.push(this._attributesToXml());
	}

	if (this._children.length || this._textContent) {
		str.push('>');

		if (this._children.length) {
			str.push(this._childrenToXml());
		}

		if (this._textContent) {
			str.push(_encode(this._textContent));
		}

		str.push('</' + this._nodeName + '>');
	}
	else {
		str.push('/>');
	}

	return str.join('');
};

Element.prototype._attributesToXml = function () {
	return ' ' + this._attributes.map(function (attr) {
		return attr.toXml();
	}).join(' ');
};

Element.prototype.addChild = function (element) {
	if (element instanceof Element) {
		this._children.push(element);
	}
	else {
		throw new Error('element.addChild(): You can add only Element instance.');
	}
};

Element.prototype._childrenToXml = function () {
	return this._children.map(function (attr) {
		return attr.toXml();
	}).join('');
};

Element.prototype.addAttribute = function (attribute) {
	if (arguments.length == 1 && arguments[0] instanceof Attribute) {
		this._attributes.push(arguments[0]);
	}
	else {
		this._attributes.push(new Attribute(arguments[0], arguments[1]));
	}
};

Element.prototype.getAttributes = function () {
	return this._attributes;
};

// ATTR class
function Attribute (name, value) {
	this._name = name;
	this._value = value;
};

Attribute.prototype.toXml = function () {
	return this._name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() + '="' + _encode(this._value) + '"';
};

function _parseObject (obj, nodeName) {
	var el = new Element(nodeName);

	if (Array.isArray(obj)) {
			for (var i = 0, l = obj.length; i < l; i++) {
				el.addChild(_parseObject(obj[i], Json2Xml.config.collectionItemTagName));
			}
	}
	else if (typeof obj === 'string' ||
		typeof obj === 'number' ||
		typeof obj === 'boolean' ||
		obj === null) {
		el.setTextContent(obj);
	}
	else {
		for (var prop in obj) {
			var propVal = obj[prop];

			if (typeof propVal === 'object') {
				el.addChild(_parseObject(propVal, prop));
			}
			else  {
				el.addAttribute(prop, propVal);
			}
		}
	}

	return el;
};

function _encode (str) {
  return str.toString().replace(/&/g, '&amp;')
             .replace(/</g, '&lt;')
             .replace(/>/g, '&gt;')
             .replace(/"/g, '&quot;')
             .replace(/'/g, '&apos;');
};

Json2Xml.parse = function (obj) {
	return _parseObject(obj, Json2Xml.config.rootElement);
};

Json2Xml.toXml = function (obj) {
	var doc = Json2Xml.parse(JSON.parse(JSON.stringify(obj)));

	return doc.toXml();
};

// API export
Json2Xml.Element = Element;
Json2Xml.Attribute = Attribute;

module.exports = Json2Xml;
