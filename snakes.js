
var DIRECTIONS = {UP:0, RIGHT:1, BOTTOM:2, LEFT:3}

/*** PLAYER ***/

var Player = function(id, name) {
	var _id = id;
	var _name = name;
	var _direction = DIRECTIONS.UP;
	var _head_pos = [];

	this.turn = function(dir) {
		if (DIRECTIONS.LEFT === dir) {
			_direction = (_direction - 1 + 4) % 4;
		} else if (DIRECTIONS.RIGHT === dir) {
			_direction = (_direction + 1) % 4;
		}
	}

	this.moveTo = function(newpos) {
		_head_pos = newpos;	
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

	this.getHeadPosition = function() {
        return _head_pos;
    }

}

function createPlayer(id, name) {return new Player(id, name)};

exports.createPlayer = createPlayer;
exports.DIRECTIONS = DIRECTIONS;
