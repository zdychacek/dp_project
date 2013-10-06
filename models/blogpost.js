const mongoose = require('mongoose'),
	Comment = require('./comment'),
	lastModified = require('./plugins/lastModified');

var BlogPost = new mongoose.Schema({
	title: String,
	content: String,
	comments: [ Comment ]
});

// plugin
BlogPost.plugin(lastModified);

module.exports = mongoose.model('BlogPost', BlogPost);