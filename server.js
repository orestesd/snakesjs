
var connect = require('connect'),
	http = require('http');
	

var myserver = {host:'127.0.0.1', port:8090};

var app_connect = connect().use(connect.static(__dirname+'/client'));

var app = http.createServer(app_connect).listen(myserver.port);

var io = require('socket.io').listen(app),
	GameIO = new require('./gameio.js').init(io);

io.set('log level', 1);

console.log('server started: ', myserver);