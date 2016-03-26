var mongoose = require('mongoose');

var roomSchema = mongoose.Schema({
	name: String,
	description: String
})

module.exports = mongoose.model('Room', roomSchema);
