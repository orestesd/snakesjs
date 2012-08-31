
var express = require('express');
	

var app = express.createServer();
var io = require('socket.io').listen(app);

var GameIO = new require('./gameio.js')(io);
var config = require('./config.js')(app, express, io);
var routes = require('./routes.js')(app);


app.listen(process.env.PORT || 8090);
console.log('server started %s:%s', app.address().address, app.address().port);