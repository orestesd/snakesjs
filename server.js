
var io = require('socket.io').listen(5000);

var gamejs = require('./game.js'),
	snakes = require('./snakes.js'),
	topologies = require('./topologies.js');

var games = {};

io.set('log level', 1);
io.sockets.on('connection', function (socket) {
  
  var client_name;
  var player;
  var game;

  socket.on('register', function(user){

	client_name = user.name;

  	socket.emit('registered', {client_id:socket.id, name:client_name}); 

  });

  socket.on('create-game', function(user){
  	
  	if (client_name) {

		game = createGame(socket.id);
		player = snakes.createPlayer(socket.id, client_name);
		game.addPlayer(player);

		socket.join(game.id);
  		socket.emit('game-created', {gameid:game.id}); 

	} else {
		socket.emit('error', {msg:"unregistered client can't create a game"})
	}

  });

  socket.on('join-game', function(game_id){
  	var joined_game = getGame(game_id);
  	if (joined_game && ! joined_game.isStarted()) {
  		game = joined_game;
  		player = snakes.createPlayer(socket.id, client_name);
		  game.addPlayer(player);

  		socket.join(game.id);
  		io.sockets.in(game.id).emit('game-joined', {gameid:game.id, player_names: game.getPlayerNames()}); // for himself too
  		// socket.broadcast.to(game.id).emit('game-joined', {gameid:game.id}); // not for himself
  	} else {
      socket.emit('error', {msg:"can't join a started game"})
    }
  
  });

  socket.on('start-game', function(){
    if (game && game.owner === socket.id) {
      game.start();
      io.sockets.in(game.id).emit('game-started');
    } else {
      socket.emit('error', {msg:"only the game creator cant start the game"})
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

function getGame(id) {
	return games[id];
} 

exports.getGame = getGame;
