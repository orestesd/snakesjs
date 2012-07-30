SnakeJS.events = (function(app, $, undefined) {
    
    var keys_def = {
    	37 : 3, // 'LEFT',
    	38 : 0, // 'UP',
    	39 : 1, // 'RIGHT',
    	40 : 2, // 'BOTTOM',
    	32 : 5  // 'SHOOT' // spacebar
    }
    
    var pressed_keys = {};
    
    var start_key_tracking = function() {
        $(document).keydown(function(evt) {
            var key_value = keys_def[evt.keyCode];
            if (key_value) {
                // pressed_keys[key_value] = 1;
                
                var command = {
                    dir : key_value,
                    timestamp: new Date().getTime()
                }
                app.io.emit('command', command);
            }
        });
        $(document).keyup(function(evt) {
            var key_value = keys_def[evt.keyCode];
            if (key_value) {
                // pressed_keys[key_value] = 0;
            }
        });
    }

    $(document).ready(function() {
    	// listen key events


        // listen action events
    	$('#register').click(function() {
    		var player_name = $('#player_name').val();

            if (player_name) {
                app.io.emit('register', {name: player_name});
            }

    	});

        $('#create_game').click(function() {
            if (app.player_name) {
                app.io.emit('create-game');
            }
        });
    	
        $('#join_game').click(function() {
            var game_id = $('#game_id').val();
            
        });
    	
    	$('#start_game').click(function() {
            app.io.emit('start-game');
    	});


        // listen global events
        
        $(document).bind('registered', function(event, data) {
            console.log('registered:', app.player_name, app.player_id);

            $('#player_name').parent().removeClass('hide');
            $('.registered').prepend($('<span/>').text('Welcome ' + app.player_name));
            $('.registered').removeClass('hide');
        });

        $(document).bind('game-created', function(event, data) {
            console.log('game-created:', app.game_id);

            $('#game').removeClass('hide');
        });

        $(document).bind('game-joined', function(event, data) {
            console.log('game-joined:', app.game_id);
        });

        $(document).bind('game-started', function(event, data) {
            console.log('game-started:', data);
            start_key_tracking();
        });

        $(document).bind('game-status', function(event, data) {
            app.drawer.update(data)
        });

        $(document).bind('error', function(event, data) {
            console.log('error:', data);

            var $msg = $('<div class="alert alert-error" />').append(data.msg);
            $('.container').prepend($msg);
        });
    
    });
    
	return {
		raise_global : function(event_name, params) {$(document).trigger(event_name, Array.prototype.slice.call(arguments, 1))}
	};
	
})(SnakeJS, jQuery);
