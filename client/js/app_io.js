SnakeJS.io = (function(app, io, undefined) {

	var socket = io.connect('/');
	
	var emit = function(name, data) {
		 socket.emit(name, data);
	};

	socket.on('registered', function(data) {
		app.events.raise_global('registered', data);
	});

	socket.on('game-created', function(data){
		app.events.raise_global('game-created', data);
	});

	socket.on('game-joined', function(data) {
		app.events.raise_global('game-joined', data);
	});

	socket.on('game-started', function(data) {
		app.events.raise_global('game-started', data);
	});

	socket.on('game-status', function(data) {
		app.events.raise_global('game-status', data);
	});

	socket.on('error', function(data) {
		app.events.raise_global('error', data);
	});

    return {
		emit : emit
	};
	
})(SnakeJS || {}, io);
