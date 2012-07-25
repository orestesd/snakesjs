
var Game = function(world) {

	var _world = world;
	var _id = random(100000, 999999);
	var _players = [];
	var _status = -1;
	var _age = 0;

	this.step = function() {
		if (this.isStarted()) {
			_age += 1;
		}
	}

	this.start = function() {
		if (! this.isStarted()) {
			_world.init(_players);
			_status = 1;	
		}
	}

	this.addPlayer = function(player) {
		if (! this.isStarted()) {
			_players.push(player);
		}
	}

	this.getPlayers = function() {
		return _players;
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

	// FIXME duplicate code
	function random(a, b) {
		return Math.round(Math.random()*(b-a)+a);
	}
}

exports.createGame = function(world) {
	return new Game(world);
}