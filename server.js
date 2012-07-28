
var io = require('socket.io').listen(5000);


var clients = [];


io.sockets.on('connection', function (socket) {
  
  var client_name;

  socket.on('register',function(user){

	client_name = user.name;

  	socket.emit('registered', {id:socket.id, name:client_name}); 

  });

  socket.on('create-game',function(user){
  	
  	if (client_name) {
	  	var gameid = new Date().getTime();

	  	socket.set('gameid', gameid, function () { 
	  		socket.emit('game-created', {id:gameid}); 
	  	});

	} else {
		socket.emit('error', {msg:"unregistered client can't create a game"})
	}

  });

});

exports.getClients = function() {
	return clients;
}