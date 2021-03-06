var EventEmitter = require("events").EventEmitter;
var util = require('util');

var Game = function(world) {
	var MIN_PLAYERS = 1;
	var MAX_PLAYERS = 2;

	var _world = world;
	var _players = [];
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
			this.emit('step');
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
		}
	}

	this.getPlayers = function() {
		return _players;
	}

	this.getPlayer = function(id) {
		for (var i = 0; i < _players.length; i++) {
			var player = _players[i];
			if (player.getId() === id) {
				return player; 
			}
		};
		return undefined;
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

	this.getStatus = function(calllback){
		var players = [];
		for (var i = 0; i < _players.length; i++) {
			var p = _players[i];
			players[i] = {
				name: p.getName(),
				positions : p.getPositions(),
				dir: p.getDirection(),
				dead : p.isDead()
			};
		};

		var _items = this.getWorld().getItems();
		var items = [];
		for (var i = 0; i < _items.length; i++) {
			var itp = _items[i];
			if (itp) {
				items[i] = {
					name : itp.item.name,
					eaten : itp.eaten,
					position : itp.pos
				};
			}
		};
		
		var status = {
			players : players,
			items : items
		};

		return calllback(status);
	}

	// event functions
	this.on('step', function() {
		_world.moveAll();

		var placeItems = Math.random() < 0.05;
        if (!!placeItems) {
          _world.putItems();
        }
	});
	
	// FIXME duplicate code
	function random(a, b) {
		return Math.round(Math.random()*(b-a)+a);
	}
}

util.inherits(Game, EventEmitter);

exports.createGame = function(world) {
	return new Game(world);
}