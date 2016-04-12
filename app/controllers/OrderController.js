var OrderController  = function (model) {
    this.uuid = require('node-uuid');
    this.ApiResponse = require('../models/api-response.js');
    this.ApiMessages = require('../models/api-messages.js');
    this.model = model;
	this.shortid = require('shortid32');
	
	console.log("Initialization Membership Controller");
};





module.exports = OrderController;