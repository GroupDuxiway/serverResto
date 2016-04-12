var UserController = function (userModel) {
    this.uuid = require('node-uuid');
    this.ApiResponse = require('../models/api-response.js');
    this.ApiMessages = require('../models/api-messages.js');
    this.userModel = userModel;
	this.shortid = require('shortid32');
	this.codes = require('voucher-code-generator');
	this.codes_user ={
		length: 12,
		count: 1,
		charset: "0123456789",
		prefix: "USR-",
		postfix: "-2015",
		pattern: "####-####-####-####"
	};	
	console.log("Initialization UserController");
};

UserController.prototype.apply = function (newUser, callback) {
    var me = this;

    me.userModel.findOne({ email: newUser.email }, function (err, user ) {
		if (err) {
            return callback(err, new me.ApiResponse({ success: false, msg: me.ApiMessages.DB_ERROR, err:err ,extras: { msg: me.ApiMessages.DB_ERROR, err:err  } }));
        }
       if (user) {
            return callback(err, new me.ApiResponse({ success: false, msg: me.ApiMessages.EMAIL_ALREADY_EXISTS,err:err,
			   extras: { msg: me.ApiMessages.EMAIL_ALREADY_EXISTS, user:user, err:err  }, 
						data :{user:user}
			   }));
        } else {
		
			newUser.secretKey =me.shortid.generate();
			newUser.tokenId = me.uuid.v4();
			newUser.anizenId = me.codes.generate(me.codes_user);
            me.userModel.create(newUser, function (err, numberAffected) {
                if (err) {				
                    return callback(err, new me.ApiResponse({ success: false, msg: me.ApiMessages.DB_ERROR, err:err , extras: { msg: me.ApiMessages.DB_ERROR, err:err }	}));
                }

				return callback(err, new me.ApiResponse({
						success: true, 
						extras: {
							data: newUser
						}, 
						data : newUser
					})
				);	
			});
		}
	});
};



UserController.prototype.unapplyMembership = function (criteria, data, callback) {
    var me = this;

    me.userModel.findOneAndUpdate(criteria,data, function (err, update ) {
		if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR, err:err  } }));
        }

		return callback(err, new me.ApiResponse({
			success: true, extras: {
				data: update
			}
		}));

    });
};

module.exports = UserController;