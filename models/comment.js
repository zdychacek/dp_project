const mongoose = require('mongoose');

var Comment = new mongoose.Schema({
    title: Date,
    body: String
});

module.exports = mongoose.model('Comment', Comment);