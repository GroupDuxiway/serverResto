// ./models/user.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: String,
    firstName: String,
    lastName: String,
	activationKey:: String,
	userTokenId,
	lastConnectionDate:date,
	applyDate:date,
	activationDate:date
});

module.exports = mongoose.model('User', UserSchema);