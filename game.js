
var Game = function(world) {

	var _world = world;
	var _id = random(100000, 999999);

	this.getWorld = function() {
		return _world;
	}

	this.getId = function() {
		return _id;
	}

	// FIXME duplicate code
	function random(a, b) {
		return Math.round(Math.random()*(b-a)+a);
	}
}

exports.createGame = function(world) {
	return new Game(world);
}