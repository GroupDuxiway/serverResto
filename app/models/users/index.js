var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var roles = 'user customer admin'.split(' ');
var business  = 'hrc taxy beauty'.split(' ');
var service  = 'hrc taxy beauty'.split(' ');
var findOrCreate = require('mongoose-findorcreate');




var Post = new Schema ({
  title: {
    required: true,
    type: String,
    trim: true,
    // match: /^([[:alpha:][:space:][:punct:]]{1,100})$/
    match: /^([\w ,.!?]{1,100})$/
  },
  url: {
    type: String,
    trim: true,
    max: 1000
  },
  text: {
    type: String,
    trim: true,
    max: 2000
  },
  comments: [{
    text: {
      type: String,
      trim: true,
      max:2000
    },
    author: {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      name: String
    }
  }],
  watches: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  author: {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  created: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated:  {
    type: Date,
    default: Date.now,
    required: true
  }
});

Post.pre('save', function (next) {
  if (!this.isModified('updated')) this.updated = new Date;
  next();
})

var User = new Schema({

  userName: {
    type: String,
    required: false,
    trim: true
  },
  
  firstName: {
    type: String,
    required: false,
    trim: true
  },
  lastName: {
    type: String,
    required: false,
    trim: true
  },
  displayName: {
    type: String,
    required: false,
    trim: true
  },
 password: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: false,
    trim: true
  },
  phone: {
    type: String,
    required: false,
    trim: true
  },
  role: {
    type:String,
    enum: roles,
    required: true,
    default: roles[0]
  },
  approved: {
    type: Boolean,
    default: true
  },
  banned: {
    type: Boolean,
    default: false
  },
  admin: {
    type: Boolean,
    default: false
  },
  
  language: {
    type: String,
    required: false,
    trim: true,
	default: "en"
  }, 
  headline: String,
  photoUrl: String,
  created: {
    type: Date,
    default: Date.now
  },
  updated:  {
    type: Date,
    default: Date.now
  },
  posts: {
    own: [Schema.Types.Mixed],
    likes: [Schema.Types.Mixed],
    watches: [Schema.Types.Mixed],
    comments: [Schema.Types.Mixed]
  },
  stripeToken: Schema.Types.Mixed,
  
  adress  : {
	  name: String,
	  street : String,
	  city : String,
	  country : String,
	  gpslong : String,
	  gpslat : String
  },
  
  
});

User.plugin(findOrCreate);

User.statics.findProfileById = function(id, fields, callback) {
  var User = this;
  var Post = User.model('Post');

  return User.findById(id, fields, function(err, obj) {
    if (err) return callback(err);
    if (!obj) return callback(new Error('User is not found'));

    Post.find({
      author: {
        id: obj._id,
        name: obj.displayName
      }
    }, null, {
      sort: {
        'created': -1
      }
    }, function(err, list) {
      if (err) return callback(err);
      obj.posts.own = list || [];
      Post.find({
        likes: obj._id
      }, null, {
        sort: {
          'created': -1
        }
      }, function(err, list) {
        if (err) return callback(err);
        obj.posts.likes = list || [];
        Post.find({
          watches: obj._id
        }, null, {
          sort: {
            'created': -1
          }
        }, function(err, list) {
          if (err) return callback(err);
          obj.posts.watches = list || [];
          Post.find({
            'comments.author.id': obj._id
          }, null, {
            sort: {
              'created': -1
            }
          }, function(err, list) {
            if (err) return callback(err);
            obj.posts.comments = [];
            list.forEach(function(post, key, arr) {
              post.comments.forEach(function(comment, key, arr) {
                if (comment.author.id.toString() == obj._id.toString())
                  obj.posts.comments.push(comment);
              });
            });
            callback(null, obj);
          });
        });
      });
    });
  });
}

exports.Post = Post;



exports.User = User;


var Company = new Schema({

  appId: {
    type: String,
    required: true,
    trim: true
  },
  
  applicationName: {
    type: String,
    required: false,
    trim: true
  },
  applicationDesc: {
    type: String,
    required: false,
    trim: true
  },
  companyName: {
    type: String,
    required: false,
    trim: true
  },
 
  phone: {
    type: String,
    required: false,
    trim: true
  },
  
  email: {
    type: String,
    required: false,
    trim: true
  }, 
  contact: {
    type: String,
    required: false,
    trim: true
  }, 
  website: {
    type: String,
    required: false,
    trim: true
  }, 
  adress  : {
	  street : String,
	  area : String,
	  city : String,
	  country : String,
	  gpslong : String,
	  gpslat : String
  },
  datas  :{
	"type": "object",
	"properties": {
		"hours": { "type": "String" },
		"cuisine": { "type": "String"},
		"category": { "type": "String"},
		"description": { "type": "String"}
	  }
	},
   business: {
    type:String,
    enum: business,
    required: true,
    default: business[0]
  },
  approved: {
    type: Boolean,
    default: true
  },
  banned: {
    type: Boolean,
    default: false
  },
    created: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated:  {
    type: Date,
    default: Date.now,
    required: true
  },
  entity : {
    type: String,
    required: false,
    trim: true
  }
});


exports.Company = Company;



var Entity = new Schema({

  entityId: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: false,
    trim: true
  },
  desc: {
    type: String,
    required: false,
    trim: true
  },
 
  phone: {
    type: String,
    required: false,
    trim: true
  },
  
  email: {
    type: String,
    required: false,
    trim: true
  }, 
  contact: {
    type: String,
    required: false,
    trim: true
  }, 
  
  website: {
    type: String,
    required: false,
    trim: true
  }, 
  adress  : {
	  street : String,
	  area : String,
	  city : String,
	  country : String,
	  gpslong : String,
	  gpslat : String
  },
  features  : {
	  taxy : Boolean,
	  beautycare : Boolean,
	  restaurant : Boolean,
	  sommmelier : Boolean,
	  dating : Boolean,
	  delivery : Boolean
  },
  datas  :{
	"type": "object",
	"properties": {
		"hours": { "type": "String" },
		"cuisine": { "type": "String"},
		"category": { "type": "String"},
		"description": { "type": "String"}
	  }
	},
   business: {
    type:String,
    enum: business,
    required: true,
    default: business[0]
  },
  approved: {
    type: Boolean,
    default: true
  },
  banned: {
    type: Boolean,
    default: false
  },
    created: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated:  {
    type: Date,
    default: Date.now,
    required: true
  }
});


exports.Entity = Entity;




var Offer = new Schema({


  offerId: {
    type: String,
    required: true,
    trim: true
  },
  packageId: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: false,
    trim: true
  },
  desc: {
    type: String,
    required: false,
    trim: true
  },
  rateplan:{
      "type": "array",
      "items": {
         "type": "object",
         "properties": {
          "name": {
             "type": "string"
          },
		  "description": {
             "type": "string"
          },
          "price": {
            "type": "string"
          }
        }
      }
    },
  created: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated:  {
    type: Date,
    default: Date.now,
    required: true
  }
});


exports.Offer = Offer;




var Product = new Schema({


  entityId: {
    type: String,
    required: true,
    trim: true
  },
  productId: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: false,
    trim: true
  },
  desc: {
    type: String,
    required: false,
    trim: true
  },
  rateplan:{
      "type": "array",
      "items": {
         "type": "object",
         "properties": {
          "name": {
             "type": "string"
          },
		  "description": {
             "type": "string"
          },
          "price": {
            "type": "string"
          }
        }
      }
    },
  created: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated:  {
    type: Date,
    default: Date.now,
    required: true
  }
});


exports.Product = Product;






var Package = new Schema({

  entityId: {
    type: String,
    required: true,
    trim: true
  },
  packageId: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: false,
    trim: true
  },
  desc: {
    type: String,
    required: false,
    trim: true
  },
  rateplan:{
      "type": "array",
      "items": {
         "type": "object",
         "properties": {
          "name": {
             "type": "string"
          },
		  "description": {
             "type": "string"
          },
          "price": {
            "type": "string"
          }
        }
      }
    },
  created: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated:  {
    type: Date,
    default: Date.now,
    required: true
  }
});

exports.Package = Package;






var Command = new Schema({


  entityId: {
    type: String,
    required: true,
    trim: true
  },
  commandId: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: false,
    trim: true
  },
  desc: {
    type: String,
    required: false,
    trim: true
  },
  rateplan:{
      "type": "array",
      "items": {
         "type": "object",
         "properties": {
          "name": {
             "type": "string"
          },
		  "description": {
             "type": "string"
          },
          "price": {
            "type": "string"
          }
        }
      }
    },
  created: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated:  {
    type: Date,
    default: Date.now,
    required: true
  }
});


exports.Command = Command;




var Datting = new Schema({

  entityId: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: String,
    required: true,
    trim: true
  },
  datemeeting: {
    type: Date,
    default: Date.now,
    required: true
  },
  status: {
    type: Date,
    default: Date.now,
    required: true
  },
  created: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated:  {
    type: Date,
    default: Date.now,
    required: true
  }
});

exports.Datting = Datting;





var Event = new Schema({

  entityId: {
    type: String,
    required: true,
    trim: true
  },
  eventId: {
    type: String,
    required: true,
    trim: true
  },
  dateevent: {
    type: Date,
    default: Date.now,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },  
  desc: {
    type: String,
    required: true,
    trim: true
  }, 
  
  status: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated:  {
    type: Date,
    default: Date.now,
    required: true
  }
});

exports.Event = Event;





var Taxy = new Schema({

  entityId: {
    type: String,
    required: true,
    trim: true
  },
  taxyId: {
    type: String,
    required: true,
    trim: true
  },

  name: {
    type: String,
    required: true,
    trim: true
  },  
  desc: {
    type: String,
    required: true,
    trim: true
  }, 
  
  status: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated:  {
    type: Date,
    default: Date.now,
    required: true
  }
});

exports.Taxy = Taxy;






var Sommelier = new Schema({
  sommelierId: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: false,
    trim: true
  },
  desc: {
    type: String,
    required: false,
    trim: true
  },
  advice: {
    type: String,
    required: false,
    trim: true
  },
  country: {
    type: String,
    required: false,
    trim: true
  },
  type: {
    type: String,
    required: false,
    trim: true
  },
  rateplan:{
      "type": "array",
      "items": {
         "type": "object",
         "properties": {
          "name": {
             "type": "string"
          },
		  "description": {
             "type": "string"
          },
          "price": {
            "type": "string"
          }
        }
      }
    },
  created: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated:  {
    type: Date,
    default: Date.now,
    required: true
  }
});


exports.Sommelier = Sommelier;





var Request = new Schema({
  requestId: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: false,
    trim: true
  },
  desc: {
    type: String,
    required: false,
    trim: true
  },
  message: {
    type: String,
    required: false,
    trim: true
  },
  answerId: {
    type: String,
    required: false,
    trim: true
  },
  type: {
    type: String,
    required: false,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated:  {
    type: Date,
    default: Date.now,
    required: true
  }
});


exports.Request = Request;


// Thread : post message waiting for an answer
// could be attached to meeting, request, reservation,..
var Thread = new Schema ({
  title: {
    required: true,
    type: String,
    trim: true,
    // match: /^([[:alpha:][:space:][:punct:]]{1,100})$/
    match: /^([\w ,.!?]{1,100})$/
  },
  // Meeting, buying, messages
  subjectType: {
    type: String,
    trim: true,
    max: 1000
  },
  status : {
    type: String,
    trim: true,
    max: 1000
  },
  subject: {
    type: String,
    trim: true,
    max: 2000
  },
  sendto : [{
    id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
     }
  }],
  threads: [{
    text: {
      type: String,
      trim: true,
      max:2000
    },
    author: {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      name: String
    },
	created: {
		type: Date,
		default: Date.now,
		required: true
	}
  }],
  watches: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  author: {
     type: Schema.Types.ObjectId,
     ref: 'User',
     required: true
  },
  created: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated:  {
    type: Date,
    default: Date.now,
    required: true
  }
});

Thread.pre('save', function (next) {
  if (!this.isModified('updated')) this.updated = new Date;
  next();
})
exports.Thread = Thread;





// Meeting date : post events, comming date, message waiting for an answer
// could be attached to meeting, request, reservation,..
var Meeting = new Schema ({
  title: {
    required: true,
    type: String,
    trim: true,
    // match: /^([[:alpha:][:space:][:punct:]]{1,100})$/
    match: /^([\w ,.!?]{1,100})$/
  },
  // Meeting type datting, haircare,reservation
  subjectType: {
    type: String,
    trim: true,
    max: 1000
  },
  // status open, close, cancel, pending,change request
  status : {
    type: String,
    trim: true,
    max: 1000
  },
  subject: {
    type: String,
    trim: true,
    max: 2000
  },
  
  users : [{
    id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
     }
  }],

  entity : [{
    id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
     }
  }],  
  
  where: [{
	// Restaurant, master, ...
	entity: {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'Entity'
      }
    },
	user: {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  }],
  
  threads: [{
    text: {
      type: String,
      trim: true,
      max:2000
    },
    author: {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      name: String
    },
	created: {
		type: Date,
		default: Date.now,
		required: true
	}
  }],
  watches: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  author: {
     type: Schema.Types.ObjectId,
     ref: 'User',
     required: true
  },
  created: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated:  {
    type: Date,
    default: Date.now,
    required: true
  }
});

Thread.pre('save', function (next) {
  if (!this.isModified('updated')) this.updated = new Date;
  next();
})
exports.Thread = Thread;
