/* The API controller
   Exports 3 methods:
   * post - Creates a new thread
   * list - Returns a list of threads
   * show - Displays a thread and its posts
*/


var Thread = require('../models/thread.js');
var Post = require('../models/post.js');
var User = require('../models/user.js');
var restify = require('restify');
var anizenkey = "1234567890";

var passport = require('passport')
        , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'api_key',
    passwordField: 'api_secret'
},
function (username, password, done) {
    console.log(username + 'username');
    if (username != 'test') {
        return done(null, false, {message: 'Incorrect username.'});
    } else {
        return done(null, {
            id: 1,
            email: 'test@as.com',
            username: 'test'
        });
    }
}
));
		
exports.checkKey= function(req, res, next) {

    var key =  req.query.key ;
	if (key== null) {
        return next(new restify.NotAuthorizedError("No API key supplied"));
    } else if (key== anizenkey) {
         return next();
    }	
	return next(new restify.NotAuthorizedError("Unknown API key "));

};


exports.apply = function(req, res, next) {

	if(req.body.email =='unittest2@duxiway.com') {	 
		// EXIST 
		var user = {
		  status: 'EXIST'
		};
		res.status(200).json(user);
	}  else 
	if(req.body.email =='unittest3@duxiway.com') {	
		// BLOCK 
		var user = {
		  status: 'BLOCK'
		};
		res.status(200).json(user);
	} else 	{

		var user = {
		  email: req.body.email,
		  alias: req.body.alias,
		  tokenid:'111111'
		};
		res.status(200).json(user);
	} 
	
}

exports.activation = function(req, res, next) {
		 
	if(req.body.tokenid =='111111') {	 
		var user = {
		  status: 'ACTIVATE',
		};	
		res.status(200).json(user);
	} else if(req.body.tokenid =='111112') {
		// ALREDAY ACTIVATED
		var user = {
		  status: 'ACTIVATE',
		};	
		res.status(200).json(user);
	} else if(req.body.tokenid =='111113') {
		//BLOCK 
		var user = {
		  status: 'BLOCK',
		};	
		res.status(200).json(user);
	} else 	{
		var user = {
		  status: 'UNKNOWN',
		};	
		res.status(200).json(user);
	}
}


exports.listUsers = function(req, res) {
     User.list(res);
}
exports.addUser = function(req, res) {
    User.add(user["user4"],res);
}
exports.removeUser = function(req, res) {
     User.remove(2,res);
}


exports.thread = function(req, res) {
    new Thread({title: req.body.title, author: req.body.author}).save();
}


exports.post = function(req, res) {
    new Thread({title: req.body.title, author: req.body.author}).save();
}

exports.list = function(req, res) {
  Thread.find(function(err, threads) {
    res.end(threads);
  });
}

// first locates a thread by title, then locates the replies by thread ID.
exports.show = (function(req, res) {
    Thread.findOne({title: req.params.title}, function(error, thread) {
        var posts = Post.find({thread: thread._id}, function(error, posts) {
          res.send([{thread: thread, posts: posts}]);
        });
    })
});