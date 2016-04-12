
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var Schema = mongoose.Schema;
var userStatus = {
  values: 'pending activ block remove'.split(' '),
  message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
};

var UserSchema = new Schema({
	anizenId: { type: String, lowercase: true , index: true},
    email:  { type: String, lowercase: true , index: true},
	phone:  { type: String, lowercase: true , index: true},
	alias:  { type: String, lowercase: true },
	datas: [{ key: String, value: Schema.Types.Mixed}],
	name:  { 
		first:  { type: String},
		last: { type: String}
	},
	secretKey: String,
	tokenId: String,
	status:{ type: String, enum: userStatus, default: 'pending' , lowercase: true },
	lastConnectionDate:{type: Date, default: Date.now},
	applyDate: {type: Date, default: Date.now},
	activationDate: {type: Date, default: Date.now}
});
UserSchema.virtual('name.full').get(function () {
  return this.contact.first + ' ' + this.contact.last;
});

UserSchema.index({ secretKey: 1, tokenId:1}); // schema leve

exports.User = mongoose.model('User', UserSchema);


var posStatus = {
  values: 'pending activ block remove'.split(' '),
  message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
};
var PosSchema = new Schema({
    anizenId: { type: String, index: true},
	name:  { type: String, lowercase: true , index: true},
	email:  { type: String, lowercase: true , index: true},
	phone:  { type: String, lowercase: true , index: true},
	networks:   { 
		facebook:  { type: String},
		vk: { type: String},
		twitter: { type: String},
		country: { type: String}
	},
	address:   { 
		street:  { type: String},
		number: { type: String},
		city: { type: String},
		country: { type: String}
	},
	contract :   { 
		name:  { type: String}
	},		
	company:   { 
		name:  { type: String},
		siren: { type: String}
	},		
	gps:   { 
		latitude:  { type: String},
		longitude: { type: String}
	},	
	contact:  { 
		first:  { type: String},
		last: { type: String}
	},
	secretKey: String,
	tokenId: String,
	logo: { name: String, color:String,label: String, cdn:String},
	datas: [{ key: String, value: Schema.Types.Mixed}],
	status:{ type: String, enum: posStatus, default: 'pending' , lowercase: true },
	lastConnectionDate:{type: Date, default: Date.now},
	applyDate: {type: Date, default: Date.now},
	activationDate: {type: Date, default: Date.now}
});

PosSchema.virtual('company.full').get(function () {
  return this.company.name ;
});

PosSchema.virtual('address.full').get(function () {
  return this.address.number + ',' + this.address.street + ' ' + this.address.city + ' ' + this.address.country;
});

PosSchema.virtual('contact.full').get(function () {
  return this.contact.first + ' ' + this.contact.last;
});

exports.Pos = mongoose.model('Pos', PosSchema);



var PosMembershipCardSchema = new Schema({
    posId:{ type: String, index: true},
	name: { type: String},
	logo: { name: String, color:String,label: String, cdn:String},
	datas: [{ key: String, value: Schema.Types.Mixed}]
});


exports.PosMembershipCard = mongoose.model('PosMembershipCard', PosMembershipCardSchema);



var memberStatus = {
  values: 'request reject pending activ block remove'.split(' '),
  message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
};

var MembershipSchema = new Schema({
    membershipId: {type: String,index: true},
    userId: {type: String,index: true},
	posId: {type: String,index: true}, 
	card :  Schema.Types.Mixed,
	activationId: {type: String},	 
	name:  {first:String,last:String},
	status:{ type: String, enum: memberStatus, default: 'request' , lowercase: true },
	endDate: {type: Date},
	startDate: {type: Date},
	lastConnectionDate:{type: Date, default: Date.now},
	applyDate: {type: Date, default: Date.now},
	activationDate: {type: Date, default: Date.now},
	datas: [{ key: String, value: Schema.Types.Mixed}]
});

exports.Membership = mongoose.model('Membership', MembershipSchema);


var orderStatus = {
  values: 'pending send confirm reject cancel change'.split(' '),
  message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
};
var OrderSchema = new Schema({
    orderId:{type: String,index: true}, 
    userId: {type: String,index: true}, 
	posId: {type: String,index: true}, 
	content: Schema.Types.Mixed,
	reason: {reasontype: String, message:Schema.Types.Mixed},
	status:{ type: String, enum: orderStatus, default: 'pending' , lowercase: true },
	meetingDate: {type: Date, default: Date.now},
	updateDate: {type: Date, default: Date.now},
	createDate: {type: Date, default: Date.now},
	datas: [{ key: String, value: Schema.Types.Mixed}]
});

exports.Order = mongoose.model('Order', OrderSchema);


var resourceStatus = {
  values: 'pending confirm cancel change'.split(' '),
  message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
};
var resourceType = {
  values: 'order reservation service'.split(' '),
  message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
};
var ResourceSchema = new Schema({
    resourceId: String,	 
	type:{ type: String, enum: resourceType, default: 'order' , lowercase: true },
	status:{ type: String, enum: resourceStatus, default: 'pending' , lowercase: true },
	endDate: {type: Date},
	startDate: {type: Date},
	datas: [{ key: String, value: Schema.Types.Mixed}]
});
exports.Resource = mongoose.model('Resource', ResourceSchema);


var meetingStatus = {
  values: 'pending confirm cancel change'.split(' '),
  message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
};
var meetingType = {
  values: 'order reservation service'.split(' '),
  message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
};
var MeetingSchema = new Schema({
    cardId: String,
    userId: {type: String},
	posId: {type: String},	 
	resourceId: {type: String},	 
	type:{ type: String, enum: meetingType, default: 'order' , lowercase: true },
	status:{ type: String, enum: meetingStatus, default: 'pending' , lowercase: true },
	endDate: {type: Date},
	startDate: {type: Date},
	datas: [{ key: String, value: Schema.Types.Mixed}]
});

exports.Meeting = mongoose.model('Meeting', MeetingSchema);




var bizDataType = {
  values: 'hrc fitness beauty family'.split(' '),
  message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
};
var BizDataSchema = new Schema({
	bizDataId: {type: String,index: true}, 
    posId: {type: String,index: true}, 
    content:  [{ key: String, value: Schema.Types.Mixed}],
	advertising: [{ key: String, value: Schema.Types.Mixed}],
	versionId: String,
	type:{ type: String, enum: bizDataType, default: 'hrc' , lowercase: true },
	updateDate: {type: Date, default: Date.now},
	createDate: {type: Date, default: Date.now},
	startdate:{type: Date},
	enddate:{type: Date},
	datas: [{ key: String, value: Schema.Types.Mixed}]
});

exports.BizData = mongoose.model('BizData', BizDataSchema);



var messageStatus = {
  values: 'pending distributed send'.split(' '),
  message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
};
var messageType = {
  values: 'order faq apply'.split(' '),
  message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
};
var MessageSchema = new Schema({
    threadId: {type: String,index: true}, 
    fromId: {type: String,index: true}, 
	toId: {type: String,index: true},  
	content:  Schema.Types.Mixed,
	type:{ type: String, enum: messageType, default: 'order' , lowercase: true },
	status:{ type: String, enum: messageStatus, default: 'pending' , lowercase: true },
	read: Boolean,
	createDate: {type: Date, default: Date.now},
	sendDate: {type: Date},
	
	// linkage subject object id
	messageId: {type: String,index: true}, 
    orderId: {type: String,index: true}, 
	meetingId: {type: String,index: true}, 
	datas: [{ key: String, value: Schema.Types.Mixed}]
});

exports.Message = mongoose.model('Message', MessageSchema);



/*


var childSchema = new Schema({ name: 'string' });

var parentSchema = new Schema({
  children: [childSchema]
})


childSchema.pre('save', function (next) {
  if ('invalid' == this.name) return next(new Error('#sadpanda'));
  next();
});

var parent = new Parent({ children: [{ name: 'invalid' }] });
parent.save(function (err) {
  console.log(err.message) // #sadpanda
})

var doc = parent.children.id(id);



var Parent = mongoose.model('Parent');
var parent = new Parent;

// create a comment
parent.children.push({ name: 'Liesl' });
var subdoc = parent.children[0];
console.log(subdoc) // { _id: '501d86090d371bab2c0341c5', name: 'Liesl' }
subdoc.isNew; // true

parent.save(function (err) {
  if (err) return handleError(err)
  console.log('Success!');
});


childSchema.pre('save', function(next) {
  console.log(this.name); // prints 'Leia'
});
var Parent = mongoose.model('Parent', parentSchema);
var parent = new Parent({ child: { name: 'Luke' } })
parent.child.name = 'Leia';
parent.save(callback); // Triggers the pre middleware.






var Parent = mongoose.model('Parent', parentSchema);
var parent = new Parent({ children: [{ name: 'Matt' }, { name: 'Sarah' }] })
parent.children[0].name = 'Matthew';
parent.save(callback);





// find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
  if (err) return handleError(err);
  console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation) // Space Ghost is a talk show host.
})



Person.
  find({
    occupation: /host/,
    'name.last': 'Ghost',
    age: { $gt: 17, $lt: 66 },
    likes: { $in: ['vaporizing', 'talking'] }
  }).
  limit(10).
  sort({ occupation: -1 }).
  select({ name: 1, occupation: 1 }).
  exec(callback);
  














var personSchema = Schema({
  _id     : Number,
  name    : String,
  age     : Number,
  stories : [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

var storySchema = Schema({
  _creator : { type: Number, ref: 'Person' },
  title    : String,
  fans     : [{ type: Number, ref: 'Person' }]
});

var Story  = mongoose.model('Story', storySchema);
var Person = mongoose.model('Person', personSchema);
*/