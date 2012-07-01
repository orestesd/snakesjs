
var DIRECTIONS = {UP:0, RIGHT:1, BOTTOM:2, LEFT:3}
var TILE_TYPES = {EMPTY:0, WALL:1}

/*** PLAYER ***/

var Player = function(id, name) {
	var _id = id;
	var _name = name;
	var _direction = DIRECTIONS.UP;
	
	var _tail_size = 5;
	var _positions = [];

	this.turn = function(dir) {
		if (DIRECTIONS.LEFT === dir) {
			_direction = (_direction - 1 + 4) % 4;
		} else if (DIRECTIONS.RIGHT === dir) {
			_direction = (_direction + 1) % 4;
		}
	}

	this.moveTo = function(newpos) {
		var headpos = this.getHeadPosition() || [-1, -1];
		if (! (newpos[0] === headpos[0] && newpos[1] === headpos[1])) {
			_positions[_positions.length] = newpos;

			// cortamos el/los ultimo trozo de cola
			while(_positions.length > _tail_size) {
				_positions.shift();
			}
		}
	}
	
	this.grow = function(amount) {
		_tail_size += amount;
	}

	this.resetTailSize = function() {
		_tail_size = 5;
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
        return _positions[_positions.length - 1];
    }

	this.getTailSize = function() {
        return _tail_size;
    }

	this.getPositions = function() {
		return _positions;
	}
}


/*** WORLD ***/

var World = function(topology) {
	var _grid = topology.grid;
    var _size = {h:_grid.length, w:_grid[0].length};

	this.getSize = function() {
		return _size;
	}
	
	this.getTile = function(pos) {
		return _grid[pos[0]][pos[1]];
	}
}



function createPlayer(id, name) {return new Player(id, name)};
function createWorld(topo) {return new World(topo)};

exports.createPlayer = createPlayer;
exports.createWorld = createWorld;
exports.DIRECTIONS = DIRECTIONS;
exports.TILE_TYPES = TILE_TYPES;

