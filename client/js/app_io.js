SnakeJS.io = (function(app) {

	var socket = io.connect('http://localhost:8090');
	
	var emit = function(name, data) {
		 socket.emit(name, data);
	};

    return {
		emit : emit
	};
	
})(SnakeJS);
