
/*** PLAYER ***/

var Player = function(id, name) {
	var _id = id;
	var _name = name;
	
	this.getId = function() {
		return _id;
	}
	
	this.getName = function() {
		return _name;
	}
}

function createPlayer(id, name) {return new Player(id, name)};

exports.createPlayer = createPlayer;
