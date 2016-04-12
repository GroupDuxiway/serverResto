
var email = require('emailjs');



var EmailController = function () {
    this.uuid = require('node-uuid');
    this.ApiResponse = require('../models/api-response.js');
    this.ApiMessages = require('../models/api-messages.js');

	this.from="neeno12345@gmail.com";
	
	
	this.server 	= email.server.connect({
	   user:	"neeno12345@gmail.com", 
	   password:"Wilhelmine1933", 
	  host: "smtp.gmail.com",  
	   ssl: true
	});

 
	console.log("Initialization EmailController");
};

EmailController.prototype.sendActivation = function (user, callback) {
    var me = this;

	
	var message	= {
	   text:	"Activation 2344", 
	   from:	this.from, 
	   to :  "nmanuhutu@hotmail.fr",
	   subject:	"Activation"
	  
	};

   // send the message and get a callback with an error or details of the message that was sent 
	me.server.send(message, callback);
};


module.exports = EmailController;