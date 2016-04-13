var app = require('../server/app.js');
var assert = require('assert');
var request = require('superagent');
// http = require('support/http');
var http = require('http');

var key = "1234567890";
var port = '12345';
var user1 = request.agent();
var host = 'http://localhost:' + port;



var adminUser = {
  email: 'admin-test@test.com',
  password: 'admin-test'
};

// running the server
app.run(port);

suite('Test POS Application', function() {

	var emailtest = "pos12345@gmail.com";
	var usertest = "pos12345@gmail.com";
	var tokenId = "";
	var secretKey = "";
	var posId= "";
	var userId= "";

	setup(function(done) {
		console.log('start suite test Application');
		done();
	});

	test('check /', function(done) {
		request.get('http://localhost:' +port).end(function(res) {
		  assert.equal(res.status, 404);
		  done();
		});
	});


	
	test('POS remove pos', function(done) {

		var data ={
			criteria : {
				  email: emailtest
			},
		};
		request.get('http://localhost:' +port + '/api/pos/remove?key=' + key).send(data).end(function(err, res) {
			// console.log("************** " + JSON.stringify(res.body));
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);
			done();
		});	
		
		
	});

	test(" add POS", function(done) {

		 var data = {
				email: emailtest,
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
				}
		};
		
		
		request.get('http://localhost:' +port + '/api/pos/apply?key=' + key).send(data).end(function(err, res) {
			console.log("************** " + JSON.stringify(res.body));
			assert.equal(res.status, 200);
			assert.equal(res.body.success, true);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.extras.data.email, emailtest);
			tokenId = res.body.extras.data.tokenId;
			secretKey = res.body.extras.data.secretKey;
			
			done();
		});
	});

		test('POS get by email', function(done) {

		
		 var data = {
			data : {
				email: emailtest
			}
		};		
		request.get('http://localhost:' +port + '/api/pos/search?key=' + key).send(data).end(function(err, res) {
			// console.log("************** " + JSON.stringify(res.body));
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);
			assert.equal(res.body.extras.data.email, emailtest);

			done();
		});
	});
	
	
	test('POS get by tokenId', function(done) {

		 var data = {
			data : {
				tokenId: tokenId
			}
		};		
		request.get('http://localhost:' +port + '/api/pos/search?key=' + key).send(data).end(function(err, res) {
			console.log("************** " + JSON.stringify(res.body));
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);
			assert.equal(res.body.extras.data.email, emailtest);

			done();
		});
	});
		
		
	
	test('POS get by tokenId and secretKey', function(done) {
		 var data ={
			data : {
				tokenId: tokenId, secretKey : secretKey
			}
		};
		
		request.get('http://localhost:' +port + '/api/pos/search?key=' + key).send(data).end(function(err, res) {
			// console.log("************** " + JSON.stringify(res.body));
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);
			assert.equal(res.body.extras.data.email, emailtest);

			done();
		});
	});	

	
	
	test('POS update by token id and secret id', function(done) {
		 var data ={
			criteria : {
				tokenId: tokenId, secretKey : secretKey
			},
			
			data : {
				address:   { 
					street:  "Obolonsky",
					number: "50"
				},
			}
					
			
		};
		request.get('http://localhost:' +port + '/api/pos/update?key=' + key).send(data).end(function(err, res) {
			 //console.log("************** " + JSON.stringify(res.body));
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);
			done();
		});
	});	
	
'  // pending activ block remove'.split(' '),
	test('POS status => activ ', function(done) {
		 var data ={
			criteria : {
				tokenId: tokenId, secretKey : secretKey
			},
			data : {
				status:  "activ"
			}
		};
		
		request.get('http://localhost:' +port + '/api/pos/update?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);

			request.get('http://localhost:' +port + '/api/pos/search?key=' + key).send(data).end(function(err, res) {
				console.log("************** " + JSON.stringify(res.body));
				assert.equal(res.status, 200);
				if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
				assert.equal(res.body.success, true);
				assert.equal(res.body.extras.data.status, "activ");
				done();
			});				
			
		});
		
		
	});	
	
	test('¨POS status => remove ', function(done) {
		 var data ={
			criteria : {
				tokenId: tokenId, secretKey : secretKey
			},
			data : {
				status:  "remove"
			}
		};
		
		request.get('http://localhost:' +port + '/api/pos/update?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);
			
			request.get('http://localhost:' +port + '/api/pos/search?key=' + key).send(data).end(function(err, res) {
				// console.log("************** " + JSON.stringify(res.body));
				assert.equal(res.status, 200);
				if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
				assert.equal(res.body.success, true);
				assert.equal(res.body.extras.data.status, "remove");
				done();
			});	
			
		});
		
	});		
	
	
	test('POS status => block ', function(done) {
		 var data ={
			criteria : {
				tokenId: tokenId, secretKey : secretKey
			},
			data : {
				status:  "block"
			}
		};
		
		request.get('http://localhost:' +port + '/api/pos/update?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);
		
			
			request.get('http://localhost:' +port + '/api/pos/search?key=' + key).send(data).end(function(err, res) {
				// console.log("************** " + JSON.stringify(res.body));
				assert.equal(res.status, 200);
				if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
				assert.equal(res.body.success, true);
				assert.equal(res.body.extras.data.status, "block");
				done();
		
			});	
			
			
		});
		
	});		
	
	
	test('POS status => pending ', function(done) {
		 var data ={
			criteria : {
				tokenId: tokenId, secretKey : secretKey
			},
			data : {
				status:  "pending"
			}
		};
		
		request.get('http://localhost:' +port + '/api/pos/update?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);
		
			
			request.get('http://localhost:' +port + '/api/pos/search?key=' + key).send(data).end(function(err, res) {
				// console.log("************** " + JSON.stringify(res.body));
				assert.equal(res.status, 200);
				if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
				assert.equal(res.body.success, true);
				assert.equal(res.body.extras.data.status, "pending");
				done();
		
			});	
			
			
		});
		
	});		
	
	test('user add user', function(done) {

		 var data = {
		  email: usertest,
		  alias: 'unittest'
		};
		request.get('http://localhost:' +port + '/api/user/apply?key=' + key).send(data).end(function(err, res) {
			// console.log("************** " + JSON.stringify(res.body));
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
	
	

	test('user apply as member of POS', function(done) {

		 var data ={
			criteria : {
				tokenId: tokenId, secretKey : secretKey
			},
			data : {
				userId:userId,
				posId: posId
			}
		};
		
		request.get('http://localhost:' +port + '/api/user/applyMembership?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);	
			done();			
		});
	
		
	});
	
	test('POS get user who want to be membership', function(done) {

		var data ={
			criteria : {
				tokenId: tokenId, secretKey : secretKey
			},
			data : {
				posId: posId
			}
		};
		
		request.get('http://localhost:' +port + '/api/user/getMembershipRequest?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);
			assert.equal(res.body.extras.data.status, "request");
			done();			
		});
	});

	test('POS validat membership', function(done) {


		var data ={
			criteria : {
				tokenId: tokenId, secretKey : secretKey
			},
			data : {
				posId: posId,
				userId: userId,
				status:"activ"
			}
		};
		
		request.get('http://localhost:' +port + '/api/user/processMembershipRequest?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);
			assert.equal(res.body.extras.data.status, "activ");
			membershipId=res.body.extras.data.membershipId;	
			done();			
		});

	});
	
	test('POS reject membership', function(done) {

		var data ={
			criteria : {
				tokenId: tokenId, secretKey : secretKey
			},
			data : {
				posId: posId,
				userId: userId,
				status:"reject"
			}
		};
		
		request.get('http://localhost:' +port + '/api/user/processMembershipRequest?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);
			assert.equal(res.body.extras.data.status, "reject");
			
			done();			
		});
	});	
	
	test('POS get member new order', function(done) {

		 var data ={
			criteria : {
				tokenId: tokenId, 
				secretKey : secretKey,
				max:10,
				posId:posId,
				status:"send"
			}
		
		};
		
		request.get('http://localhost:' +port + '/api/pos/searchOrder?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);	
			done();			
		});
	});

	test('POS validat order', function(done) {

		 var data ={
			criteria : {
				tokenId: tokenId, 
				secretKey : secretKey
			
			},
			data : {
				orderId:orderId,
				status:"validat",
				data:[{key:"message",value:"values"}]
			}
		};
		
		request.get('http://localhost:' +port + '/api/pos/changeOrder?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);	
			done();			
		});
		
	});
	
	test('POS reject order', function(done) {

		 var data ={
			criteria : {
				tokenId: tokenId, 
				secretKey : secretKey
			
			},
			data : {
				orderId:orderId,
				status:"reject",
				data:[{key:"message",value:"reason"}]
			}
		};
		
		request.get('http://localhost:' +port + '/api/pos/changeOrder?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);	
			done();			
		});
		
	});	

	test('POS cancel order', function(done) {

		 var data ={
			criteria : {
				tokenId: tokenId, 
				secretKey : secretKey
			
			},
			data : {
				orderId:orderId,
				status:"cancel",
				data:[{key:"message",value:"reason"}]
			}
		};
		
		request.get('http://localhost:' +port + '/api/pos/changeOrder?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);	
			done();			
		});
	
	});	
	
	test('POS change date order', function(done) {

		 var data ={
			criteria : {
				tokenId: tokenId, 
				secretKey : secretKey
			
			},
			data : {
				orderId:orderId,
				status:"change",
				data:[{key:"message",value:"reason"}]
			}
		};
		
		request.get('http://localhost:' +port + '/api/pos/changeOrder?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);	
			done();			
		});
	});	
	
	test('POS answer user thread messages', function(done) {

		 var data ={
			criteria : {
				tokenId: tokenId, secretKey : secretKey,
				userId:userId,
				posId:posId
			},
			data : {
			   fromId: posId,
			   toId: userId,
			   orderId:orderId,
			   content:"contenu message",
			   data:[{key:"test",value:"values"}]
			   
			}
		};
		
		request.get('http://localhost:' +port + '/api/pos/sendMessage?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);	
			assert.equal(res.body.extras.data.status, "send");
			done();			
		});
	
	
	});	
	
	test('POS get new thread/messageccon a ORDER from user', function(done) {

		 var data ={
			criteria : {
				tokenId: tokenId, secretKey : secretKey,
				fromId:userId,
				messageId:messageId, // serach new one
				orderId:orderId
			}
		};
		
		request.get('http://localhost:' +port + '/api/pos/searchMessage?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);	

			done();			
		});
	});	
	
	
	
	
    // change or update
	test('POS put business data', function(done) {

		 var data ={
			criteria : {
				tokenId: tokenId, secretKey : secretKey,
				posId:posId
			},
			data : {
			   posId: posId,
			   content:"contenu message",
			   advertising:"contenu message",
			   type:"hrc",
			   startdate:"",
			   enddate:"",			   
			   data:[{key:"test",value:"values"}]
			}
		};
		
		request.get('http://localhost:' +port + '/api/pos/updateBizData?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);	

			done();			
		});		
		
	});	


	test('POS put advertising business data', function(done) {

		 var data ={
			criteria : {
				tokenId: tokenId, secretKey : secretKey,
				posId:posId
			},
			data : {
			   posId: posId,
			   advertising:"contenu message"
			}
		};
		
		request.get('http://localhost:' +port + '/api/pos/updateBizData?key=' + key).send(data).end(function(err, res) {
			assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);	

			done();			
		});		
		
	});	

	
	
	
	
	test('POS remove tokenId & secretKey', function(done) {

		var data ={
			criteria : {
				 tokenId: tokenId, secretKey : secretKey
			},
		};
		request.get('http://localhost:' +port + '/api/pos/remove?key=' + key).send(data).end(function(err, res) {
				assert.equal(res.status, 200);
			if(res.body.success==false) console.log("ERROR : " + res.body.extras.err);
			assert.equal(res.body.success, true);
			done();
		});	
		
		
	});
	

	teardown(function(done) {
		console.log('teardown suite POS test Application');
		done();
	});
});
