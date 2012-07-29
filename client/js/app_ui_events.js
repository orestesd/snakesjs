SnakeJS.events = (function(app) {
    
    var keys_def = {
    	37 : 'LEFT',
    	38 : 'UP',
    	39 : 'RIGHT',
    	40 : 'BOTTOM',
    	32 : 'SHOOT' // spacebar
    }
    
    var pressed_keys = {};
    
    var game_joined = function(game) {
    	$('.without_game, .with_game').toggleClass('hidden');
    	$('#game_info').text('game:_game, player:_player'.replace('_game', this.now.game_id).replace('_player', this.now.player_name));
    }
    
    $(document).bind('game_started', function() {
    	
    	$(document).keydown(function(evt) {
			var key_value = keys_def[evt.keyCode];
			if (key_value) {
				pressed_keys[key_value] = 1;
				now.send_pressed_keys(pressed_keys, new Date().getTime());
			}
		});
		$(document).keyup(function(evt) {
			var key_value = keys_def[evt.keyCode];
			if (key_value) {
				pressed_keys[key_value] = 0;
			}
		});
    });
    
    $(document).bind('game_over', function() {
    	console.log('game over');
    });
    
    $(document).ready(function() {
    	
    	$('#create_game').click(function() {
    		var player_name = $('#player_name').val();

            if (player_name) {
                app.io.emit('register', {name: player_name});
            }

    	});
    	
    	$('#join_game').click(function() {
    		var player_name = $('#player_name').val();
    		var game_id = $('#game_id').val();
    		now.join_game(game_id, player_name, game_joined);
    	});
    	
    	$('#start_game').click(function() {
    		var player_name = $('#player_name').val();
    		if (player_name)
    			now.start_game(app.game.id, player_name);
    	});
    
    });
    
	return {
		raise_global : function(event_name, params) {$(document).trigger(event_name, Array.prototype.slice.call(arguments, 1))}
	};
	
})(SnakeJS);
