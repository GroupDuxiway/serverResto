
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var Schema = mongoose.Schema;
var userStatus = {
  values: 'pending activ block remove'.split(' '),
  message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
};

var UserSchema = new Schema({
	anizenId: String,
    email:  { type: String, lowercase: true },
	alias:  { type: String, lowercase: true },
	secretKey: String,
	tokenId: String,
	status:{ type: String, enum: userStatus, default: 'pending' , lowercase: true },
	lastConnectionDate:{type: Date, default: Date.now},
	applyDate: {type: Date, default: Date.now},
	activationDate: {type: Date, default: Date.now}
});

exports.User = mongoose.model('User', UserSchema);
