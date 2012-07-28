
var io = require('socket.io').listen(5000);


var clients = [];


io.sockets.on('connection', function (socket) {
  
  socket.on('register',function(user){
  	
  	socket.set('name', user.name, function () { 
  		socket.emit('registered', {id:socket.id, name:user.name}); 
  	});

  });

});

exports.getClients = function() {
	return clients;
}