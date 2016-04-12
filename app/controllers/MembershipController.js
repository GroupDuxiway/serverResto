var MembershipController  = function (model) {
    this.uuid = require('node-uuid');
    this.ApiResponse = require('../models/api-response.js');
    this.ApiMessages = require('../models/api-messages.js');
    this.model = model;
	this.shortid = require('shortid32');
	
	console.log("Initialization Membership Controller");
};



MembershipController.prototype.applyMembership = function (criteria,membership, callback) {
    var me = this;


	
    me.model.findOne(criteria, function (err, data ) {
	
		if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR, err:err  } }));
        }

        if (data) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.ALREADY_EXISTS, data:data, err:err  } }));
        } else {

			membership.membershipId =me.shortid.generate();
			membership.activationId=me.shortid.generate();
			
            me.model.create(membership, function (err, numberAffected) {
                if (err) {				
					console.log("erreur :" + err);
                    return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR, err:err } }));
                }
                    

				return callback(err, new me.ApiResponse({
					success: true, extras: {
						data: membership
					}
				}));
          

            });
        }

    });
};


MembershipController.prototype.validatMembership = function (criteria,membership, callback) {
    var me = this;


    me.model.findOneAndUpdate(criteria,membership, function (err, update ) {
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



module.exports = MembershipController;