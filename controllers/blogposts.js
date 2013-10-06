const BlogPost = require('../models/blogpost'),
	Comment = require('../models/comment');

exports.index = function (req, res) {
	BlogPost.find({}, function (err, posts) {
		if (err) {
			return console.log(err);
		}

		res.json(posts);
	});
};

exports.new = function (req, res) {
	var blogpost = new BlogPost({
		title: 'Titulek ' + Math.floor(Math.random() * 100),
		content: 'obsah',
		comments: []
	});

	blogpost.save(function (err) {
		if (err) {
			console.log(err);
		}

		res.json(blogpost);
	})
};

exports.create = function (req, res) {
	res.json({});
};

exports.show = function (req, res) {
	res.json({});
};

exports.edit = function (req, res) {
	res.json({});
};

exports.update = function (req, res) {
	res.json({});
};

exports.destroy = function (req, res) {
	res.json({});
};