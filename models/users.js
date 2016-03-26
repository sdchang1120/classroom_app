// REQUIREMENTS
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var roomSchema = require('./rooms').schema;

// USER'S SCHEMA
var userSchema = mongoose.Schema({
	username: {type: String, required: true, unique: true},
  first_name: {type: String, required: true},
  last_name: String,
  email: String,
  password: {type: String, required: true},
	rooms: [roomSchema]
});

// GENERATE HASH
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// VALIDATE PASSWORD
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);
