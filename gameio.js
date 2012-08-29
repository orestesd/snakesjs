


var gamejs = require('./game.js'),
	snakes = require('./snakes.js'),
	topologies = require('./topologies.js');

var games = {};
var commands = {};

var update_clients_freq = 1000 / 7;
var update_game_freq = 1000 / 7;

function init_io(io){

  io.sockets.on('connection', function (socket) {
    
    var client_name;
    var player;
    var game;
    var updateClientsInterval;
    var updateGameInterval;

    socket.on('register', function(user){
      console.log('[%s] registering user %s', socket.id, user.name);
      
      client_name = user.name;
      commands[client_name] = [];
      socket.emit('registered', {client_id:socket.id, client_name:client_name}); 
    });

    socket.on('create-game', function(user){
      if (client_name) {
        game = createGame(socket.id);
        player = snakes.createPlayer(socket.id, client_name);
        game.addPlayer(player);

        socket.join(game.id);
        socket.emit('game-created', {game_id:game.id, topology:game.getWorld().getTopology()}); 

        console.log('[%s] created game %s', socket.id, game.id);
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
        io.sockets.in(game.id).emit('game-joined', {game_id:game.id, topology:game.getWorld().getTopology(), player_names: game.getPlayerNames()}); // for himself too
        // socket.broadcast.to(game.id).emit('game-joined', {game_id:game.id}); // not for himself

        console.log('[%s] joined game %s', socket.id, game.id);
      } else {
        socket.emit('error', {msg:"can't join a started game"})
      }
    
    });

    socket.on('start-game', function(){
      if (game && game.owner === socket.id) {
        game.start();
        io.sockets.in(game.id).emit('game-started');
        
        updateGameInterval = initUpdateGameInterval(io, game);
        updateClientsInterval = initUpdateClientsInterval(io, game);

        console.log('[%s] started game %s', socket.id, game.id);
      } else {
        socket.emit('error', {msg:"only the game creator cant start the game"})
      }
    });

    socket.on('command', function(command){ 
      if (game && player) {
        commands[client_name].push(command);
      }
    });

  });
}

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

function processCommands(game) {
  var players = game.getPlayers();
  for (var i = 0; i < players.length; i++) {
    var player = players[i];
    var current_command = commands[player.getName()].shift();

    if (current_command) {
      player.turn(current_command.dir);
    }
  };
}

function initUpdateClientsInterval(io, game) {
  var interval = setInterval(function() {
      var game_status = game.getStatus();

      game_status.game_id = game.id;
      game_status.timestamp = new Date().getTime();

      io.sockets.in(game.id).emit('game-status', game_status);
  
  }, update_clients_freq);

  return interval;
}

function initUpdateGameInterval(io, game) {
  var interval = setInterval(function() {
      processCommands(game);
      game.step();

      io.sockets.in(game.id).emit('game-step');
  }, update_game_freq);

  return interval;
}

exports.init = function(io){
  init_io(io);

  return {
    getGame : getGame
  };
}
