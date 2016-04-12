var express = require('express'); 
var app = exports.app = express(); 
 
 console.log('*************Hello World app'); 
app.get('/yy', function(req, res){ 
    res.send('Hello World app'); 
}); 