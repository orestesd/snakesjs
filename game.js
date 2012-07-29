
var Game = function(world) {
	var MIN_PLAYERS = 1;
	var MAX_PLAYERS = 2;

	var _world = world;
	var _id = random(100000, 999999);
	var _players = [];
	var _players_map = {};
	var _status = -1;
	var _age = 0;

	this.command = function(cmd) {
		var player = _world.getPlayer(cmd.player);
		if (player) {
			player.turn(cmd.dir);
		}
	}

	this.step = function() {
		if (this.isStarted()) {
			_age += 1;
			_world.moveAll();
		}
	}

	this.start = function() {
		if (! this.isStarted() && _players.length >= MIN_PLAYERS) {
			_world.init(_players);
			_status = 1;	
		}
	}

	this.addPlayer = function(player) {
		if (! this.isStarted() && _players.length < MAX_PLAYERS) {
			_players.push(player);
			_players_map[player.getId()] = player;
		}
	}

	this.getPlayers = function() {
		return _players;
	}

	this.getPlayer = function(id) {
		return _players_map[id];
	}

	this.getPlayerNames = function() {
		var names = [];
		for (var i = 0; i < _players.length; i++) {
			names.push(_players[i].getName());		
		}
		return names;
	}

	this.getWorld = function() {
		return _world;
	}

	this.getId = function() {
		return _id;
	}

	this.getAge = function() {
		return _age;
	}

	this.isStarted = function() {
		return _status !== -1;
	}

	this.getMinPlayers = function() {
		return MIN_PLAYERS;
	}

	this.getMaxPlayers = function() {
		return MAX_PLAYERS;
	}

	// FIXME duplicate code
	function random(a, b) {
		return Math.round(Math.random()*(b-a)+a);
	}
}

exports.createGame = function(world) {
	return new Game(world);
}