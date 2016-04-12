var PosController = function (posModel) {
    this.uuid = require('node-uuid');
    this.ApiResponse = require('../models/api-response.js');
    this.ApiMessages = require('../models/api-messages.js');
    this.posModel = posModel;
	this.shortid = require('shortid32');
	this.codes = require('voucher-code-generator');
	this.codes_membercard ={
		length: 12,
		count: 1,
		charset: "0123456789",
		prefix: "CARD-",
		postfix: "-2015",
		pattern: "####-####-####-####"
	};
	this.codes_promo ={
		length: 12,
		count: 1,
		charset: "0123456789",
		prefix: "PROM-",
		postfix: "-2015",
		pattern: "####-####-####-####"
	};	
	this.codes_pos ={
		length: 12,
		count: 1,
		charset: "0123456789",
		prefix: "POS-",
		postfix: "-2015",
		pattern: "####-####-####-####"
	};	
    
	
	console.log("Initialization PosController");
};

PosController.prototype.apply = function (newPos, callback) {
    var me = this;

    me.posModel.findOne({ email: newPos.email }, function (err, pos ) {
	
		
		if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR, err:err  } }));
        }

        if (pos) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.POS_ALREADY_EXISTS, pos:pos, err:err  } }));
        } else {
		
			newPos.secretKey =me.shortid.generate();
			newPos.tokenId = me.uuid.v4();
			newPos.anizenId = me.codes.generate(me.codes_pos);
            me.posModel.create(newPos, function (err, numberAffected) {
			
              if (err) {				
					console.log("erreur :" + err);
                    return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR, err:err } }));
                }
				
				return callback(err, new me.ApiResponse({
					success: true, extras: {
						data: newPos
					}
				}));
          

            });
        }

    });
};


PosController.prototype.processMembershipRequestPos = function (newPos, callback) {
    var me = this;

};




module.exports = PosController;