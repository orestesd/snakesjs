
var DIRECTIONS = {UP:0, RIGHT:1, BOTTOM:2, LEFT:3}

/*** PLAYER ***/

var Player = function(id, name) {
	var _id = id;
	var _name = name;
	var _direction = DIRECTIONS.UP;
	
	this.turn = function(dir) {
		if (DIRECTIONS.LEFT === dir) {
			_direction = (_direction - 1 + 4) % 4;
		} else if (DIRECTIONS.RIGHT === dir) {
			_direction = (_direction + 1) % 4;
		}
	}
	
	this.getId = function() {
		return _id;
	}
	
	this.getName = function() {
		return _name;
	}
	
	this.getDirection = function() {
		return _direction;
	}
}

function createPlayer(id, name) {return new Player(id, name)};

exports.createPlayer = createPlayer;
exports.DIRECTIONS = DIRECTIONS;
