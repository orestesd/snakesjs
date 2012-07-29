
var connect = require('connect'),
	http = require('http'),
	GameIO = new require('./gameio.js');

var myserver = {host:'127.0.0.1', port:8090};

var app_connect = connect().use(connect.static(__dirname+'/client'));

var app = http.createServer(app_connect).listen(myserver.port);

console.log('server started: ', myserver);