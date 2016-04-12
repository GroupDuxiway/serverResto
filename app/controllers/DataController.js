DataController = function (model, dataname) {
    this.uuid = require('node-uuid');
    this.ApiResponse = require('../models/api-response.js');
    this.ApiMessages = require('../models/api-messages.js');
    this.modeldb = model;
	
	console.log("==> Initialization Data Controler  : " + dataname);
};

DataController.prototype.query = function (setting, query, callback) {
    var me = this;

	query._id= {$gt: setting.current_id};
	
    me.modeldb.find({},function (err, results) { 
		if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR, err:err  } }));
        }
			
		return callback(err, new me.ApiResponse({
			success: true, extras: {
				data: results
			}
		}));
		
    });
};

DataController.prototype.create = function (criteria, newdata, callback) {
    var me = this;

    me.modeldb.findOne(criteria, function (err, data ) {
		if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR, err:err  } }));
        }

        if (data) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DATA_ALREADY_EXISTS, Data:data, err:err  } }));
        } else {
		
            me.modeldb.create(newdata, function (err, numberAffected) {
                if (err) {				
                    return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR, err:err } }));
                }
                    
				return callback(err, new me.ApiResponse({
					success: true, extras: {
						data: newdata
					}
				}));
          

            });
        }

    });
};



DataController.prototype.forcecreate = function (newdata, callback) {
    var me = this;

   		
	me.modeldb.create(newdata, function (err, numberAffected) {
		if (err) {				
			return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR, err:err } }));
		}
			
		return callback(err, new me.ApiResponse({
			success: true, extras: {
				data: newdata
			}
		}));
  

	});
       
};


DataController.prototype.search = function (data, callback) {
    var me = this;

    me.modeldb.findOne(data, function (err, data ) {
		if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR, err:err  } }));
        }

        if (data) {
			return callback(err, new me.ApiResponse({
				success: true, extras: {
					data: data
				}
			}));
		
        } else {
			return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.ApiMessages.DATA_NOT_FOUND, err:err  } }));
            
        }

    });
};

DataController.prototype.update = function (criteria,data,callback) {
    var me = this;

    me.modeldb.findOneAndUpdate(criteria,data, function (err, update ) {
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


DataController.prototype.remove = function (criteria,data,callback) {
    var me = this;
    me.modeldb.findOneAndRemove(criteria,data, function (err, update ) {
		if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR, err:err  } }));
        }

       
		return callback(err, new me.ApiResponse({
			success: true, extras: {
				data: {}
			}
		}));
    });
};

DataController.prototype.removeAll = function (criteria,callback) {
    var me = this;
    me.modeldb.remove(criteria,function (err) {
		if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR, err:err  } }));
        }

       
		return callback(err, new me.ApiResponse({
			success: true, extras: {
				data: {}
			}
		}));
    });
};
module.exports = DataController;