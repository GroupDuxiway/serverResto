var DataController = function (model, dataname) {
    this.uuid = require('node-uuid');
    this.ApiResponse = require('../models/api-response.js');
    this.ApiMessages = require('../models/api-messages.js');
    this.model = model;
	
	console.log("Initialization Data Controler" + dataname);
};

DataController.prototype.search = function (model, callback) {
    var me = this;

    me.model.findOne(model, function (err, model ) {
		if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR, err:err  } }));
        }

        if (model) {
			return callback(err, new me.ApiResponse({
				success: true, extras: {
					model: model
				}
			}));
		
        } else {
			return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.ApiMessages.DATA_NOT_FOUND, err:err  } }));
            
        }

    });
};

DataController.prototype.update = function (criteria,data,callback) {
    var me = this;

    me.userModel.findOneAndUpdate(criteria,data, function (err, update ) {
		if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR, err:err  } }));
        }

       
		return callback(err, new me.ApiResponse({
			success: true, extras: {
				Data: update
			}
		}));

		


    });
};

module.exports = DataController;