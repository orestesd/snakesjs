
var io = require('socket.io').listen(5000);

var gamejs = require('./game.js'),
	snakes = require('./snakes.js'),
	topologies = require('./topologies.js');

var games = {};


io.sockets.on('connection', function (socket) {
  
  var client_name;
  var game;

  socket.on('register',function(user){

	client_name = user.name;

  	socket.emit('registered', {clientid:socket.id, name:client_name}); 

  });

  socket.on('create-game',function(user){
  	
  	if (client_name) {

		game =createGame(socket.id);

	  	socket.set('gameid', game.id, function () { 
	  		socket.emit('game-created', {gameid:game.id}); 
	  	});

	} else {
		socket.emit('error', {msg:"unregistered client can't create a game"})
	}

  });

});

function createGame(owner) {
	var topo = topologies.getAll().walled;
	var world = snakes.createWorld(topo);
	var game = gamejs.createGame(world);
	
	game.id = new Date().getTime();
	game.owner = owner;
	games[game.id] = game;

	return game;
}

exports.getGame = function(id) {
	return games[id];
}