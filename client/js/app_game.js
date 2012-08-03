SnakeJS.game = (function(app, undefined) {

	var _status = {};

	var update = function(status) {
		_status = status;
	};

	var getStatus = function() {
		return _status;
	};

	return {
		update : update,
		getStatus : getStatus
	}

})(SnakeJS || {});