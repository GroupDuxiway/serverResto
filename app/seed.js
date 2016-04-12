var express = require('express');
var mongoose = require('mongoose');
var promisify = require('deferred').promisify
// Read Synchrously
 var fs = require("fs");



var key = "1234567890";
var port = '8080';
var host = 'http://localhost:' + port;
var request = require('superagent');
var debug=true;


var file_name= "balsinger.json";


// Error handlers
// =============================================
function logErrors(err, req, res, next) {
    if (typeof err === 'string')
        err = new Error(err);
    console.error('logErrors', err.toString());
    next(err);
}

function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        console.error('clientErrors response');
        res.status(500).json({ error: err.toString() });
    } else {
        next(err);
    }
}

function errorHandler(err, req, res, next) {
    console.error('lastErrors response');
    res.status(500).send(err.toString());
}

// Database handlers
// =============================================
var mongoConnection= 'mongodb://@127.0.0.1:27017/anizen';
// DB Connection
var connection = mongoose.createConnection(mongoConnection);
connection.on('connected', function (param) {
    var date = new Date();
    console.log( date.toUTCString() + " Database connected ");
});
connection.on('error', function(error){
	var date = new Date();
	console.log(date.toUTCString() + " Connection error: " + error);
});

connection.on('disconnected', function (param) {
    var date = new Date();
    console.log(date.toUTCString() + " Connection disconnected: " + param);
});


var models = require('./models/models.js');

var User = connection.model('User', models.User, 'users');
var Pos =connection.model('Pos', models.Pos, 'pos');
var PosMembershipCard =connection.model('PosMembershipCard', models.PosMembershipCard, 'PosMembershipCards');
var Membership =connection.model('Membership', models.Membership, 'Memberships');
var Order =connection.model('Order', models.Order, 'Orders');
var Message =connection.model('Message', models.Message, 'Messages');
var BizData =connection.model('BizData', models.BizData, 'BizDatas');


var trace = function (err,numberRemoved) {
		if (err) {
              console.log("REMOVE NO OK " + err );
        } else console.log("OK numberRemoved : " + numberRemoved);

 };
 
// insertion database cleaning 
var cleaning = function(done) {


    Pos.remove({},trace);
	User.remove({},trace);
	Membership.remove({},trace);
	PosMembershipCard.remove({},trace);
	BizData.remove({},trace);
	
	
	
	Message.remove({},trace);
	Order.remove({},trace);


	
};





// User
//==================================
var addUser = function (posId) {

	var arrayLength = usersData.length;
	for (var i = 0; i < arrayLength; i++) {
		var data = usersData[i];
		if (debug == true) console.log("**** AddUser data : ****" + JSON.stringify(data));
		request.get('http://localhost:' +port + '/api/user/apply?key=' + key).send(data).end(function(err, res) {
			if (debug == true) console.log("**** AddUser reponse : ****" + JSON.stringify(res.body));
			usersData[i] = res.body.extras.user;
		});
	}
	


};


// Add Membershipcard
//==================================
var addMembershipcard = function (pos) {


	var arrayLength = membershipcardData.length;
	for (var i = 0; i < arrayLength; i++) {
		var data = membershipcardData[i];
		data.posId=pos.anizenId;
		if (debug == true) console.log("**** addMembershipcard data : ****" + JSON.stringify(data));
		request.get('http://localhost:' +port + '/api/pos/addCard?key=' + key).send(data).end(function(err, res) {
			if (debug == true) console.log("**** addMembershipcard reponse : ****" + JSON.stringify(res.body));

		});
	}
};


// applyMembership
//==================================
var applyMembership = function (pos,user,card) {


	var arrayLength = membershipData.length;
	for (var i = 0; i < arrayLength; i++) {
		var data1 = membershipData[i];

		var data ={
			criteria : {
				userId: user.anizenId,
				posId: pos.anizenId	
			},
			data : data1
		};	
		data.data.userId= user.anizenId;
		data.data.posId=pos.anizenId;
		
		if (debug == true) console.log("**** applyMembership data : ****" + JSON.stringify(data));
		request.get('http://localhost:' +port + '/api/user/applyMembership?key=' + key).send(data).end(function(err, res) {
			if (debug == true) console.log("**** applyMembership reponse : ****" + JSON.stringify(res.body));

		});
	}
};


		

// Add bizData
//==================================
var addBizData = function (pos) {

	var arrayLength = bizData.length;
	for (var i = 0; i < arrayLength; i++) {
		var data = {
			data : bizData[i]
		}
		data.data.posId=pos.anizenId;
		if (debug == true) console.log("**** addBizData data : ****" + JSON.stringify(data));
		request.get('http://localhost:' +port + '/api/pos/addBizData?key=' + key).send(data).end(function(err, res) {
			if (debug == true) console.log("**** addBizData reponse : ****" + JSON.stringify(res.body));

		});
	}
};


// Add Pos
//==================================
var addPos = function () {

	var arrayLength = posData.length;
	for (var i = 0; i < arrayLength; i++) {
		var data = posData[i];
		if (debug == true) console.log("**** addPos data : ****" + JSON.stringify(data));
		request.get('http://localhost:' +port + '/api/pos/apply?key=' + key).send(data).end(function(err, res) {
			if (debug == true) console.log("**** addPos reponse : ****" + JSON.stringify(res.body));
			addMembershipcard(res.body.extras.data);
			addUser(res.body.extras.data);
			addBizData(res.body.extras.data);
			
		});
	}
};



cleaning();

var contentsUsers = fs.readFileSync("./imports/users/" + file_name);
var usersData = JSON.parse(contentsUsers);

var contentsPos = fs.readFileSync("./imports/pos/" + file_name);
var posData = JSON.parse(contentsPos);

var contentsMembershipcard = fs.readFileSync("./imports/membershipcard/" + file_name);
var membershipcardData = JSON.parse(contentsMembershipcard);

var contentsMembershipcard = fs.readFileSync("./imports/membershipcard/" + file_name);
var membershipcardData = JSON.parse(contentsMembershipcard);

var contentsMembership = fs.readFileSync("./imports/membership/" + file_name);
var membershipData = JSON.parse(contentsMembership);

var contentsBizData = fs.readFileSync("./imports/bizdata/" + file_name);
var bizData = JSON.parse(contentsBizData);


setTimeout(function() {
	addPos();
}, 3000);

/*

MongoClient.connect("mongodb://myserver:27017/test", function(err, db) {
    // Get the collection
    var col = db.collection('myColl');

    // Initialize the Ordered Batch
    // You can use initializeUnorderedBulkOp to initialize Unordered Batch
    var batch = col.initializeOrderedBulkOp();

    for (var i = 0; i < sizeOfResult; ++i) {
      var newKey = {
          field_1: result[i][1],
          field_2: result[i][2],
          field_3: result[i][3]
      };
      batch.insert(newKey);
    }

    // Execute the operations
    batch.execute(function(err, result) {
      console.dir(err);
      console.dir(result);
      db.close();
    });
});
*/
