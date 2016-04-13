var app = require('../server/app.js');
var assert = require('assert');
var request = require('superagent');
// http = require('support/http');
var http = require('http');

var key = "1234567890";
var port = '12345';
var user1 = request.agent();
var host = 'http://localhost:' + port;
var posId= "";
var userId= "";
var membershipId= "";
var messageId= "";




var adminUser = {
  email: 'admin-test@test.com',
  password: 'admin-test'
};

// running the server
app.run(port);

suite('Test User Application', function() {

	var emailtest = "neeno12345@gmail.com";
	var postest = "pos12345@gmail.com";
	var tokenId = "";
	var secretKey = "";
	var activationId="";
	var orderId="";
	var debug=false;
	
	setup(function(done) {
		if (debug == true) console.log('start suite User test Application');
		done();
	});

	test('check /', function(done) {
		request.get('http://localhost:' +port).end(function(res) {
		  assert.equal(res.status, 404);
		  done();
		});
	});


	
	test('user remove email', function(done) {

		var data ={
			criteria : {
				  email: emailtest
			},
		};
		request.get('http://localhost:' +port + '/api/user/remove?key=' + key).send(data).end(function(err, res) {
			if (debug == true) console.log("************** " + JSON.stringify(res.body));
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);
			done();
		});	
		
		
	});

	test('user add user', function(done) {

		 var data = {
		  email: emailtest,
		  alias: 'unittest'
		};
		request.get('http://localhost:' +port + '/api/user/apply?key=' + key).send(data).end(function(err, res) {
			if (debug == true) console.log("************** " + JSON.stringify(res.body));
			assert.equal(res.status, 200);
			assert.equal(res.body.success, true);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.extras.data.email, emailtest);
			assert.equal(res.body.extras.data.alias, 'unittest');
			tokenId = res.body.extras.data.tokenId;
			secretKey = res.body.extras.data.secretKey;
			userId = res.body.extras.data.anizenId;
			done();
		});
	});

	test('user get by email', function(done) {

		
		 var data = {
			data : {
				email: emailtest
			}
		};		
		request.get('http://localhost:' +port + '/api/user/search?key=' + key).send(data).end(function(err, res) {
			if (debug == true) console.log("************** " + JSON.stringify(res.body));
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);
			assert.equal(res.body.extras.data.email, emailtest);

			done();
		});
	});
	
	
	test('user get by tokenId', function(done) {
		
		 var data = {
			data : {
				tokenId: tokenId
			}
		};		
		request.get('http://localhost:' +port + '/api/user/search?key=' + key).send(data).end(function(err, res) {
			if (debug == true) console.log("************** " + JSON.stringify(res.body));
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);
			assert.equal(res.body.extras.data.email, emailtest);

			done();
		});
	});
		
		
	
	test('user get by tokenId and secretKey', function(done) {
		 var data ={
			data : {
				tokenId: tokenId, secretKey : secretKey
			}
		};
		
		request.get('http://localhost:' +port + '/api/user/search?key=' + key).send(data).end(function(err, res) {
			if (debug == true) console.log("************** " + JSON.stringify(res.body));
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);
			assert.equal(res.body.extras.data.email, emailtest);

			done();
		});
	});	

	
	
	test('user update by token id and secret id', function(done) {
		 var data ={
			criteria : {
				tokenId: tokenId, secretKey : secretKey
			},
			
			data : {
				alias:  "NINO"
			}
					
			
		};
		request.get('http://localhost:' +port + '/api/user/update?key=' + key).send(data).end(function(err, res) {
			if (debug == true) console.log("************** " + JSON.stringify(res.body));
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);
			done();
		});
	});	
	
'  // pending activ block remove'.split(' '),
	test('user status => activ ', function(done) {
		 var data ={
			criteria : {
				tokenId: tokenId, secretKey : secretKey
			},
			data : {
				status:  "activ"
			}
		};
		
		request.get('http://localhost:' +port + '/api/user/update?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);

			request.get('http://localhost:' +port + '/api/user/search?key=' + key).send(data).end(function(err, res) {
				if (debug == true) console.log("************** " + JSON.stringify(res.body));
				assert.equal(res.status, 200);
				if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
				assert.equal(res.body.success, true);
				assert.equal(res.body.extras.data.status, "activ");
				done();
			});				
			
		});
		
		
	});	
	
	test('user status => remove ', function(done) {
		 var data ={
			criteria : {
				tokenId: tokenId, secretKey : secretKey
			},
			data : {
				status:  "remove"
			}
		};
		
		request.get('http://localhost:' +port + '/api/user/update?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);
			
			request.get('http://localhost:' +port + '/api/user/search?key=' + key).send(data).end(function(err, res) {
				if (debug == true) console.log("************** " + JSON.stringify(res.body));
				assert.equal(res.status, 200);
				if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
				assert.equal(res.body.success, true);
				assert.equal(res.body.extras.data.status, "remove");
				done();
			});	
			
		});
		
	});		
	
	
	test('user status => block ', function(done) {
		 var data ={
			criteria : {
				tokenId: tokenId, secretKey : secretKey
			},
			data : {
				status:  "block"
			}
		};
		
		request.get('http://localhost:' +port + '/api/user/update?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);
		
			
			request.get('http://localhost:' +port + '/api/user/search?key=' + key).send(data).end(function(err, res) {
				if (debug == true) console.log("************** " + JSON.stringify(res.body));
				assert.equal(res.status, 200);
				if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
				assert.equal(res.body.success, true);
				assert.equal(res.body.extras.data.status, "block");
				done();
		
			});	
			
			
		});
		
	});		
	
	
	test('user status => pending ', function(done) {
		 var data ={
			criteria : {
				tokenId: tokenId, secretKey : secretKey
			},
			data : {
				status:  "pending"
			}
		};
		
		request.get('http://localhost:' +port + '/api/user/update?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);
		
			
			request.get('http://localhost:' +port + '/api/user/search?key=' + key).send(data).end(function(err, res) {
				if (debug == true) console.log("************** " + JSON.stringify(res.body));
				assert.equal(res.status, 200);
				if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
				assert.equal(res.body.success, true);
				assert.equal(res.body.extras.data.status, "pending");
				done();
		
			});	
			
			
		});
		
	});		
	
	test('POS remove by email', function(done) {

		var data ={
			criteria : {
				 email: postest
			},
		};
		request.get('http://localhost:' +port + '/api/pos/remove?key=' + key).send(data).end(function(err, res) {
				assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);
			done();
		});	
		
		
	});
	
	test(" add POS", function(done) {

		 var data = {
				email: postest,
				phone: "12345678",
				address:   { 
					facebook:  "www.facebook.com",
					vk: "www.vk.com",
					twitter: "www.twitter.com",
					anizen: "www.anizen.com"
				},
				address:   { 
					street:  "",
					number: "50",
					city: "Paris",
					country: "France"
				},
				company:   { 
					name:  "Anizen",
					siren: "123456",
					phone: "0659273701"
				},		
				gps:   { 
					x:  "0",
					y: "0"
				},	
				contact:  { 
					first: "Alain",
					last: "Dupont"
				},
				logo:  { 
					name: "Balsinger",
					label: "Restarant rapide"
				},
				datas: [{ key: "Special", value: "VAlues::::"}]
		};
		
		
		request.get('http://localhost:' +port + '/api/pos/apply?key=' + key).send(data).end(function(err, res) {
			if (debug == true) console.log("************** " + JSON.stringify(res.body));
			assert.equal(res.status, 200);
			assert.equal(res.body.success, true);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.extras.data.email, postest);
			posId = res.body.extras.data.anizenId;

			done();
		});
	});
	
	var card ="";
	test(" add Card POS", function(done) {

	
		var data ={
			criteria : {
				name: "VIP",
				posId: posId
			},
			data : {
			    name: "VIP",
				posId: posId,
				logo:  { 
					name: "Balsinger",
					label: "Restarant rapide"
				},
				datas: [{ key: "Special", value: "VAlues::::"}],
			}
		};
	
		request.get('http://localhost:' +port + '/api/pos/addCard?key=' + key).send(data).end(function(err, res) {
			if (debug == true) console.log("************** " + JSON.stringify(res.body));
			assert.equal(res.status, 200);
			assert.equal(res.body.success, true);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			card = res.body.extras.data;
			done();
		});
	});
	

	
	test('user get list of POS', function(done) {

		 var data ={
			setting : {
				page_size:10,
				N:1,
				sort : {_id: 1},
				current_id:0
			},
			query : {				
			}
		};
		
		
		request.get('http://localhost:' +port + '/api/user/searchPos?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);	
			
			if (debug == true) console.log("************** " + JSON.stringify(data));
			done();			
		});
	
		
	});
	


	test('user apply as member of POS', function(done) {

		 var data ={
			criteria : {
				userId: userId,
				posId: posId	
			},
			data : {
				userId: userId,
				posId: posId,	 
				card :  card,
				status:"request",
				name:  {first:"ALain",last:"Dupont"}
			}
		};
	
		request.get('http://localhost:' +port + '/api/user/applyMembership?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);	
			if (debug == true) console.log("************** " + JSON.stringify(res.body.extras.data));
			done();			
		});
		
	});

	var activationId = "";
	test('user get pending request membership', function(done) {

		 var data ={
		 	setting : {
				page_size:10,
				N:1,
				sort : {_id: 1},
				current_id:0
			},
			query : {
				userId:userId,
				status:{ $in: [ 'request', 'reject', 'validation'] }
			}
		};
		if (debug == true) console.log("************** DATA" + JSON.stringify(data));	

			
		request.get('http://localhost:' +port + '/api/user/searchMembership?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);	
			if (debug == true) console.log("************** " + JSON.stringify(res.body.extras.data));
			activationId =  res.body.extras.data[0].activationId;

			done();			
		});
	
		
	});


	test('user activate member CARD with activation id', function(done) {

		 var data ={
			criteria : {
				userId:userId,
				activationId:activationId
			},
			data : {
				userId:userId,
				activationId:activationId,		
				status :"activ"
			}
		};
		
			request.get('http://localhost:' +port + '/api/user/activatMembership?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);	
			done();			
		});
	});

	test('user get  memberships', function(done) {

		 var data ={
		 	setting : {
				page_size:10,
				N:1,
				sort : {_id: 1},
				current_id:0
			},
			query : {
				userId:userId,
				status:{ $in: [ 'valid'] }
			}
		};
		
		request.get('http://localhost:' +port + '/api/user/searchMembership?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);	
			if (debug == true) console.log("************** " + JSON.stringify(res.body.extras.data));
			
			done();			
		});
	
		
	});
	
	
	
	
	test('user send order ', function(done) {

		 var data ={

			data : {
				status:"send",
				content: {data:"hhhhh"},
				datas:[{key:"changereason",value:"values"}]
			}
		};
				
		request.get('http://localhost:' +port + '/api/user/putOrder?key=' + key).send(data).end(function(err, res) {
		
			if (debug == true) console.log("******* user send order ==> " + JSON.stringify(res.body.extras.data));
		
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);	
			orderId = res.body.extras.data.orderId;
	
			done();			
		});
	});

	test('user cancel order ', function(done) {

		 var data ={
			criteria : {
				orderId:orderId
			},
			data : {
				orderId:orderId,
				status:"cancel",
				reason: {reasontype: "RETARD", message:"RETARD 2H"}
			}
		};
		
		request.get('http://localhost:' +port + '/api/user/updateOrder?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);	
			orderId = res.body.extras.data.orderId;
			done();			
		});
	});

	test('user change date order ', function(done) {

		 var data ={
			criteria : {
				orderId:orderId
			},
			data : {
				orderId:orderId,
				status:"change",
				meetingDate:Date.now,
				reason: {reasontype: "RETARD", message:"RETARD 2H"}
			}
		};
		
		request.get('http://localhost:' +port + '/api/user/updateOrder?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);	
			orderId = res.body.extras.data.orderId;
			done();			
		});

	});	

	
	
	
	test('user search change order status', function(done) {
	
		 var data ={
		 	setting : {
				page_size:10,
				N:1,
				sort : {_id: 1},
				current_id:0
			},
			query : {
				userId:userId,
				status:{ $in: [ 'valid','cancel', 'send', 'cancel'] }
			}
		};
		
		request.get('http://localhost:' +port + '/api/user/searchOrders?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);	
			if (debug == true) console.log("************** " + JSON.stringify(res.body.extras.data));
			
			done();			
		});
		
	
	
	});

	
	
	test('USER send new thread/messageccon a ORDER ', function(done) {

		 var data ={

			data : {
			   fromId: userId,
			   toId: posId,
			   orderId:orderId,
			   content:"contenu message",
			   type: "Order",
			   status:"send",
			   sendDate:Date.now,
			   read: false,
			   datas:[{key:"test",value:"values"}]
			   
			}
		};
	
		
		request.get('http://localhost:' +port + '/api/user/sendMessage?key=' + key).send(data).end(function(err, res) {
			if (debug == true) console.log("**************  'user send new thread/messageccon a ORDER " + JSON.stringify(res.body));
			
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);	
			assert.equal(res.body.extras.data.status, "send");
			done();			
		});
	});	
	

	test('POS send new thread/messageccon a ORDER ', function(done) {

		 var data ={

			data : {
			   fromId: posId,
			   toId: userId,
			   orderId:orderId,
			   content:"contenu message",
			   type: "Order",
			   status:"send",
			   sendDate:Date.now,
			   read: false,
			   datas:[{key:"test",value:"values"}]
			   
			}
		};
	
		
		request.get('http://localhost:' +port + '/api/user/sendMessage?key=' + key).send(data).end(function(err, res) {
			if (debug == true) console.log("**************  'user send new thread/messageccon a ORDER " + JSON.stringify(res.body));
			
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);	
			assert.equal(res.body.extras.data.status, "send");
			done();			
		});
	});	
	
	
	
	test('user get new thread/messageccon a ORDER from POS', function(done) {

		
		var data ={
		 	setting : {
				page_size:10,
				N:1,
				sort : {_id: 1},
				current_id:0
			},
			query : {
				toId:userId,
				status:{ $in: [ 'confirm'] }
			}
		};
		
		request.get('http://localhost:' +port + '/api/user/searchMessages?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);	
			if (debug == true) console.log("************** " + JSON.stringify(res.body.extras.data));
			
			done();			
		});
		
	});	

	var bizDataId="";
	
	test('POS CREATE  business data', function(done) {

		 var data ={

			data : {
			   posId: posId,
			   content:  {data:"content"},
			   advertising: [{ key: "PUB1", value: {data:"content"}}],
			   versionId: "0",
			   type:"hrc",
			   datas:[{key:"test",value:"values"}]
			   
			}
		};
	
	
		request.get('http://localhost:' +port + '/api/pos/addBizData?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);	
			if (debug == true) console.log("************** " + JSON.stringify(res.body.extras.data));
			bizDataId = res.body.extras.data.bizDataId;
			
			done();			
		});
		
	});	
	
	
	
	test('POS put advertising business data', function(done) {

		var data ={
			criteria : {
				posId:posId
			},
			data : {
				posId:posId,
			    advertising: [{ key: "PUB1", value: {data:"content  2"}}],
			}
		};
		
		request.get('http://localhost:' +port + '/api/pos/updateBizData?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);	
			orderId = res.body.extras.data.orderId;
			done();			
		});
		
	});	
	

	test('POS get  business data', function(done) {

		var data ={
		 	setting : {
				page_size:10,
				N:1,
				sort : {_id: 1},
				current_id:0
			},
			query : {
				posId:posId
			}
		};
		
		request.get('http://localhost:' +port + '/api/user/searchBizData?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);	
			if (debug == true) console.log("************** " + JSON.stringify(res.body.extras.data));
			
			done();			
		});
		
	});		
	
	test('user UN APPLY as member of POS', function(done) {

		 var data ={
			criteria : {
				anizenId:userId
			},
			data : {
				status: "remove"
			}
		};
		
		request.get('http://localhost:' +port + '/api/user/unapplyMembership?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);	
			done();			
		});
	
		
	});
	
	
	
	
	test('user remove tokenId & secretKey', function(done) {

		var data ={
			criteria : {
				 tokenId: tokenId, secretKey : secretKey
			},
		};
		request.get('http://localhost:' +port + '/api/user/remove?key=' + key).send(data).end(function(err, res) {
				assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);
			done();
		});	
		
		
	});
	
	
	test(' remove POS MEMBERSHIP ', function(done) {
		 var data ={
			criteria : {
				"card.name":  "VIP"
				
			}
		};
		
		request.get('http://localhost:' +port + '/api/pos/removeAllMembership?key=' + key).send(data).end(function(err, res) {
		
		    if (debug == true) console.log("************** remove POS MEMBERSHIP  " + JSON.stringify(res.body));
			
		
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);
			done();
			
		});
		
		

	});	
	
	test(' remove POS CARDS ', function(done) {
		 var data ={
			criteria : {
				"name":  "VIP"
				
			}
		};
		
		request.get('http://localhost:' +port + '/api/pos/removeCardTypePos?key=' + key).send(data).end(function(err, res) {
			
			if (debug == true) console.log("************** remove POS CARDS " + JSON.stringify(res.body));

			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);
			done();
			
		});

	});	

	test(' remove POS  ', function(done) {
		 var data ={
			criteria : {
				anizenId: posId
			}
		};
		
		request.get('http://localhost:' +port + '/api/pos/remove?key=' + key).send(data).end(function(err, res) {
		
			
			if (debug == true) console.log("************** remove POS " + JSON.stringify(res.body));
	
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);
			done();
			
		});

	});		
	
	test(' remove all user order   ', function(done) {
		 var data ={
			criteria : {
				userId: userId
			}
		};
		
		request.get('http://localhost:' +port + '/api/user/removeOrders?key=' + key).send(data).end(function(err, res) {
		
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);
			done();
			
		});

	});		
	
	
	test(' remove all POS  messsage   ', function(done) {
		 var data ={
			criteria : {
				fromId: userId
			}
		};
		
		request.get('http://localhost:' +port + '/api/user/removeMessages?key=' + key).send(data).end(function(err, res) {
		
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);
			done();
			
		});

	});		
	
	test(' remove all user messsage   ', function(done) {
		 var data ={
			criteria : {
				toId: userId
			}
		};
		
		request.get('http://localhost:' +port + '/api/user/removeMessages?key=' + key).send(data).end(function(err, res) {
		
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);
			done();
			
		});

	});	
	
	
	teardown(function(done) 
	{
		if (debug == true) console.log('teardown suite user test Application');
		done();
	});

});
