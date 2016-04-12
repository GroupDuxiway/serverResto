/* The API controller
   Exports 3 methods:
   * post - Creates a new thread
   * list - Returns a list of threads
   * show - Displays a thread and its posts
*/
var DataController = require('./DataController.js');
var EmailController = require('./EmailController.js');
var UserController = require('./UserController.js');
var PosController = require('./PosController.js');
var MembershipController = require('./MembershipController.js');
var shortid = require('shortid32');

var restify = require('restify');
var anizenkey = "1234567890";


exports.checkKey= function(req, res, next) {

    var key =  req.query.key ;
	if (key== null) {
        return next(new restify.NotAuthorizedError("No API key supplied"));
    } else if (key== anizenkey) {
         return next();
    }	
	return next(new restify.NotAuthorizedError("Unknown API key "));

};

// User controler API
exports.applyUser = function(req, res, next) {
    var controller = new UserController(req.db.User);

	
	controller.apply(req.body, function(err,reponse) {	 
		res.status(200).json(reponse);
	}); 
	
}


exports.searchUser = function(req, res, next) {

    var controller = new DataController(req.db.User,"User");

	controller.search(req.body.data, function(err,reponse) {	
			res.status(200).json(reponse);
	}); 
	
}


exports.updateUser = function(req, res, next) {

    var controller = new DataController(req.db.User,"User");

	
	controller.update(req.body.criteria,req.body.data, function(err,reponse) {	    
			res.status(200).json(reponse);
	}); 
	
}

exports.removeUser = function(req, res, next) {

    var controller = new DataController(req.db.User,"User");
	controller.remove(req.body.criteria,req.body.data, function(err,reponse) {	    
			res.status(200).json(reponse);
	}); 
	
}


exports.searchPosUser = function(req, res, next) {
    var controller = new DataController(req.db.Pos,"Pos");
	controller.query(req.body.setting, req.body.query, function(err,reponse) {	
			res.status(200).json(reponse);
	}); 
	

};

exports.applyMembershipUser = function(req, res, next) {

    var controller = new MembershipController(req.db.Membership);
	controller.applyMembership(req.body.criteria, req.body.data, function(err,reponse) {	
			res.status(200).json(reponse);
	}); 

};


exports.searchMembershipUser = function(req, res, next) {

    var controller = new DataController(req.db.Membership,"Membership");
	
	controller.query(req.body.setting, req.body.query, function(err,reponse) {	
			res.status(200).json(reponse);
	}); 

};
exports.validatMembershipUser = function(req, res, next) {

    var controller = new MembershipController(req.db.Membership);
	controller.validatMembership(req.body.criteria, req.body.data, function(err,reponse) {	
			res.status(200).json(reponse);
	}); 

};
exports.putOrderUser = function(req, res, next) {
	
    var controller = new DataController(req.db.Order,"Order");
		
	req.body.data.orderId =shortid.generate();
		controller.forcecreate( req.body.data, function(err,reponse) {	res.status(200).json(reponse);
	}); 
};

exports.removeOrdersUser = function(req, res, next) {

    var controller = new DataController(req.db.Order,"Order");
	controller.removeAll(req.body.criteria, function(err,reponse) {	
			res.status(200).json(reponse);
	}); 

};



exports.removeMessagesUser = function(req, res, next) {

    var controller = new DataController(req.db.Message,"Message");
	controller.removeAll(req.body.criteria, function(err,reponse) {	
			res.status(200).json(reponse);
	}); 

};

exports.updateOrderUser = function(req, res, next) {

    var controller = new DataController(req.db.Order,"Order");
	
	controller.update(req.body.criteria,  req.body.data, function(err,reponse) {	
			res.status(200).json(reponse);
	}); 

};
exports.searchOrdersUser = function(req, res, next) {
	var controller = new DataController(req.db.Order,"Order");
	controller.query(req.body.setting, req.body.query, function(err,reponse) {	
			res.status(200).json(reponse);
	}); 
};


exports.sendMessageUser = function(req, res, next) {

    var controller = new DataController(req.db.Message,"Message");
	req.body.data.messageId =shortid.generate();
	controller.forcecreate( req.body.data, function(err,reponse) {	
			res.status(200).json(reponse);
	});
	
};
exports.searchMessagesUser = function(req, res, next) {

	var controller = new DataController(req.db.Message,"Message");
	controller.query(req.body.setting, req.body.query, function(err,reponse) {	
			res.status(200).json(reponse);
	}); 
};


exports.searchBizDataUser = function(req, res, next) {


	var controller = new DataController(req.db.BizData,"BizData");
	controller.query(req.body.setting, req.body.query, function(err,reponse) {	
			res.status(200).json(reponse);
	}); 

};

exports.addBizDataPos = function(req, res, next) {

    var controller = new DataController(req.db.BizData,"BizData");
	req.body.data.bizDataId =shortid.generate();
	controller.forcecreate( req.body.data, function(err,reponse) {	
	
			res.status(200).json(reponse);
	});

};

exports.updateBizDataPos = function(req, res, next) {

    var controller = new DataController(req.db.BizData,"BizData");
	controller.update(req.body.criteria,  req.body.data, function(err,reponse) {	
			res.status(200).json(reponse);
	}); 


};



exports.unapplyMembershipUser = function(req, res, next) {


    var controller = new UserController(req.db.User);

	controller.unapplyMembership(req.body.criteria, req.body.data, function(err,reponse) {	 
		res.status(200).json(reponse);
	}); 
};



// Pos controler API
exports.applyPos = function(req, res, next) {
    var controller = new PosController(req.db.Pos);
	
	controller.apply(req.body, function(err,reponse) {	 
		res.status(200).json(reponse);
	}); 
	
}


exports.searchPos = function(req, res, next) {

    var controller = new DataController(req.db.Pos,"Pos");
	controller.search(req.body.data, function(err,reponse) {	
			res.status(200).json(reponse);
	}); 
	
}


exports.updatePos = function(req, res, next) {

    var controller = new DataController(req.db.Pos,"Pos");
	controller.update(req.body.criteria,req.body.data, function(err,reponse) {	    
			res.status(200).json(reponse);
	}); 
	
}

exports.removePos = function(req, res, next) {

    var controller = new DataController(req.db.Pos,"Pos");
	controller.remove(req.body.criteria,req.body.data, function(err,reponse) {	    
		res.status(200).json(reponse);
	}); 
	
}

exports.removeAllMembershipPos= function(req, res, next) {

    var controller = new DataController(req.db.Membership,"Membership");
	controller.removeAll(req.body.criteria,function(err,reponse) {	
		res.status(200).json(reponse);
	}); 

};


exports.removeCardTypePos= function(req, res, next) {
    var controller = new DataController(req.db.PosMembershipCard,"PosMembershipCard");
	controller.removeAll(req.body.criteria,function(err,reponse) {	   
		res.status(200).json(reponse);
	}); 

};

exports.processMembershipRequestPos= function(req, res, next) {

	controller.processMembershipRequestPos(req.body.criteria, req.body.data, function(err,reponse) {	 
		res.status(200).json(reponse);
	}); 

};

exports.addCardPos= function(req, res, next) {

    var controller = new DataController(req.db.PosMembershipCard,"PosMembershipCard");
	controller.create(req.body.criteria,req.body.data, function(err,reponse) {	    
			res.status(200).json(reponse);
	}); 

};


