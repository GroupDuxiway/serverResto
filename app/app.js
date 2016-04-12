// The main application script, ties everything together.
var express = require('express');
var mongoose = require('mongoose');
var http = require('http');
var util = require('util');
var path = require('path');
var oauth = require('oauth');
var fs = require('fs');
var https = require('https');
var querystring = require('querystring');
var vhost = require('vhost');
var logger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var csrf = require('csurf');
var errorHandler = require('errorhandler');
var api = require('./controllers/api.js');
var c = require('./config/colors');
var cors = require('cors');

// Server configuration initialization
require(path.join(__dirname, 'config', 'env-vars'));

// Create server
var app = express();

// Set server configuration
//================================================
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('ipaddress', process.env.OPENSHIFT_NODEJS_IP);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

app.use(cors());




// End server configuration
//================================================


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
// End Error handlers
// =============================================

// Virtual host handlers
// =============================================
function createVirtualHost(domainName, app) {
    return vhost(domainName,require( app ).app);
}

//Create the virtual hosts
var anizen = createVirtualHost("localhost", "./appweb.js");

//Use the virtual hosts
app.use(anizen);




// End Virtual host handlers
// =============================================



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
function db(req, res, next) {
    req.db = {
        User: connection.model('User', models.User, 'users'),
		Pos: connection.model('Pos', models.Pos, 'pos'),
        PosMembershipCard: connection.model('PosMembershipCard', models.PosMembershipCard, 'PosMembershipCards'),
		Membership:connection.model('Membership', models.Membership, 'Memberships'),
		Order:connection.model('Order', models.Order, 'Orders'),
		Message:connection.model('Message', models.Message, 'Messages'),
		BizData:connection.model('BizData', models.BizData, 'BizDatas')
    };
	

	
    return next();
}


// End database handlers
// =============================================





// Security Handlers
//================================================
var checkKey = api.checkKey;

if (process.env.NODE_ENV === 'production') {
    app.set('stripePub', process.env.STRIPE_PUB);
    app.set('stripeSecret', process.env.STRIPE_SECRET);
} else {

    app.set('stripePub', process.env.STRIPE_PUB_LOCAL);
    app.set('stripeSecret', process.env.STRIPE_SECRET_LOCAL);
}
app.use(function (req, res, next) {
    req.conf = {
        stripeSecret: app.get('stripeSecret'),
        stripePub: app.get('stripePub')
    }
    return next()
})

// End Security Handlers
//================================================


// REST SERVICES
//================================================
app.post('/api/user/apply',  checkKey, db, api.applyUser);
app.get('/api/user/search',  checkKey, db,api.searchUser);
app.get('/api/user/update',  checkKey, db,api.updateUser);
app.get('/api/user/remove',  checkKey, db,api.removeUser);
app.get('/api/user/searchPos',  checkKey, db,api.searchPosUser);
app.get('/api/user/applyMembership',  checkKey, db,api.applyMembershipUser);
app.get('/api/user/searchMembership',  checkKey, db,api.searchMembershipUser);
app.get('/api/user/activatMembership',  checkKey, db,api.validatMembershipUser);
app.get('/api/user/putOrder',  checkKey, db,api.putOrderUser);
app.get('/api/user/updateOrder',  checkKey, db,api.updateOrderUser);
app.get('/api/user/searchOrders',  checkKey, db,api.searchOrdersUser);
app.get('/api/user/unapplyMembership',  checkKey, db,api.unapplyMembershipUser);
app.get('/api/user/sendMessage',  checkKey, db,api.sendMessageUser);
app.get('/api/user/searchMessages',  checkKey, db,api.searchMessagesUser);
app.get('/api/user/searchBizData',  checkKey, db,api.searchBizDataUser);
app.get('/api/user/removeMessages',  checkKey, db,api.removeMessagesUser);
app.get('/api/user/removeOrders',  checkKey, db,api.removeOrdersUser);
app.get('/api/pos/apply',   checkKey, db, api.applyPos);
app.get('/api/pos/search',  checkKey, db,api.searchPos);
app.get('/api/pos/update',  checkKey, db,api.updatePos);
app.get('/api/pos/remove',  checkKey, db,api.removePos);
app.get('/api/pos/addBizData',  checkKey, db,api.addBizDataPos);
app.get('/api/pos/updateBizData',  checkKey, db,api.updateBizDataPos);
app.get('/api/pos/removeCardTypePos',  checkKey, db,api.removeCardTypePos);
app.get('/api/pos/removeAllMembership',  checkKey, db,api.removeAllMembershipPos);
app.get('/api/pos/processMembershipRequest',  checkKey, db,api.processMembershipRequestPos);
app.get('/api/pos/addCard',  checkKey, db,api.addCardPos);


// Set errors handlers
app.get('*', function (req, res) {
    res.status(404).send();
})
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);


// End REST SERVICES
//================================================


//================================================
// Running server
//================================================
if (require.main === module) {

    // Create HTTP server 	
    var server = http.createServer(app);
    server.listen(app.get('port'), app.get('ipaddress'), function () {
        console.info(c.white + 'Express server listening on port ' + app.get('port') + c.reset);
    });
}
else {
    console.info(c.blue + 'Running app as a module' + c.reset)
    exports.app = app;
}



exports.run= function(port) {
    // Create HTTP server 	
    var server = http.createServer(app);
    server.listen(port, app.get('ipaddress'), function () {
        console.info('Express server listening on port ' + port+ c.reset);
    });  
};







