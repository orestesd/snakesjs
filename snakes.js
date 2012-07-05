
var DIRECTIONS = {UP:0, RIGHT:1, BOTTOM:2, LEFT:3}
var TILE_TYPES = {EMPTY:0, WALL:1}

/*** PLAYER ***/

var Player = function(id, name) {
	var _id = id;
	var _name = name;
	
	var _direction = DIRECTIONS.UP;
	var _speed = 1;

	var _max_dead = 5;
	var _dead_count = 0;

	var _tail_size = 5;
	var _positions = [];

	this.turn = function(dir) {
		if (DIRECTIONS.LEFT === dir) {
			_direction = (_direction - 1 + 4) % 4;
		} else if (DIRECTIONS.RIGHT === dir) {
			_direction = (_direction + 1) % 4;
		}
	}

	this.setHeadPosition = function(pos) {
		_positions[_positions.length] = pos;
	}
	
	this.moveTo = function(newpos) {
		var headpos = this.getHeadPosition() || [-1, -1];
		if (! (newpos[0] === headpos[0] && newpos[1] === headpos[1])) {
			_positions[_positions.length] = newpos;

			// cortamos el/los ultimo trozo de cola
			while(_positions.length > _tail_size) {
				_positions.shift();
			}
		} else {
			_dead_count += 1;
		}
	}
	
	this.grow = function(amount) {
		_tail_size += amount;
	}

	this.resetTailSize = function() {
		_tail_size = 5;
	}

	this.isDead = function() {
		return _dead_count >= _max_dead;
	}

	this.getId = function() {
		return _id;
	}
	
	this.getName = function() {
		return _name;
	}
	
	this.getSpeed = function() {
		return _speed;
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

	this.getMaxLife = function() {
		return _max_dead;
	}
}


/*** WORLD ***/

var World = function(topology) {
	var _topology = topology;
	var _grid = topology.grid;
    var _size = {h:_grid.length, w:_grid[0].length};
	var _players = {};

	this.init = function(players) {
		for(var i = 0; i < players.length; i++) {
			var p = players[i];
			p.setHeadPosition(_topology.initial_pos[i]);
			_players[p.getId()] = p;
		}
	}
	
	this.move = function(player) {
		var next_position = calculateNextPosition.call(this, player.getHeadPosition(), player.getDirection());
		
		for (var id in _players) {
			var p = _players[id];
			var poss = p.getPositions();
			
			for (var j in poss) {
				var pos = poss[j];
				if (pos[0] === next_position[0] && pos[1] === next_position[1]) {
					next_position = player.getHeadPosition();
				}
			}
		}
		
		player.moveTo(next_position);
		
		_players[player.id] = player;

		function calculateNextPosition(current, direction) {
			var new_position = [current[0], current[1]];
			if (direction == DIRECTIONS.BOTTOM) {
				new_position[0] = current[0] + player.getSpeed();
			} else if (direction == DIRECTIONS.UP) {
				new_position[0] = current[0] - player.getSpeed();
			} else if (direction == DIRECTIONS.LEFT) {
				new_position[1] = current[1] - player.getSpeed();
			} else if (direction == DIRECTIONS.RIGHT) {
				new_position[1] = current[1] + player.getSpeed();
			}
			new_position[0] = new_position[0] < 0 ? 0 : new_position[0];
			new_position[1] = new_position[1] < 0 ? 0 : new_position[1];
			
			var new_position_type = this.getTile(new_position);
			if (new_position_type === TILE_TYPES.WALL) {
				new_position = current;
			}
			
			return new_position;
		}
	}
	
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

