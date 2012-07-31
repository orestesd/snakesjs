SnakeJS.drawer = (function(app, io, undefined) {

	var update = function(status) {
		var players = status.players;
		
	};

	/*
	var redraw = function(snakes) {
        var element, snake, x, y, _i, _len, _results;
        context.fillStyle = 'rgb(230,230,230)';
        for (x = 0; x <= 49; x++) {
          for (y = 0; y <= 49; y++) {
            context.fillRect(x * 10, y * 10, 9, 9);
          }
        }
        _results = [];
        for (_i = 0, _len = snakes.length; _i < _len; _i++) {
          snake = snakes[_i];
          context.fillStyle = snake.id === id ? 'rgb(170,0,0)' : 'rgb(0,0,0)';
          if (snake.id === id) {
            $("#kills").html("Kills: " + snake.kills);
            $("#deaths").html("Deaths: " + snake.deaths);
          }
          _results.push((function() {
            var _j, _len2, _ref, _results2;
            _ref = snake.elements;
            _results2 = [];
            for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
              element = _ref[_j];
              x = element[0] * 10;
              y = element[1] * 10;
              _results2.push(context.fillRect(x, y, 9, 9));
            }
            return _results2;
          })());
        }
	*/
	return {
		update : update
	}

})(SnakeJS || {});