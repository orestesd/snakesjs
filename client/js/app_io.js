SnakeJS.io = (function(app, io, undefined) {

	var socket = io.connect('http://localhost:8090');
	
	var emit = function(name, data) {
		 socket.emit(name, data);
	};

	socket.on('registered', function(data) {
		app.player_id = data.client_id;
		app.player_name = data.client_name;
		app.events.raise_global('registered', data);
	});

	socket.on('game-created', function(data){
		if (!app.game_id) {
			app.game_id = data.game_id;
		}

		app.events.raise_global('game-created', data);
	});

	socket.on('game-joined', function(data) {
		app.game_id = data.game_id;
		app.player_names = data.player_names;
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
	
})(SnakeJS, io);
