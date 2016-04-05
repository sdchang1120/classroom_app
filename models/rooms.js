// REQUIREMENTS
var mongoose = require('mongoose');

// ROOMS SCHEMA                                                                     SCHEMA
var roomSchema = mongoose.Schema({
	name: String,
	description: String
})

module.exports = mongoose.model('Room', roomSchema);
