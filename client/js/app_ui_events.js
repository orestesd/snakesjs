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
            if (typeof key_value !== undefined) {
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

        $('input').focus();

    	// listen key events


        // listen action events
    	$('#register').click(function() {
    		var player_name = $('#player_name').val();

            if (player_name) {
                app.io.emit('register', {name: player_name});
            }

    	});

        $('#create_game').click(function() {
            if (app.game.player_name) {
                app.io.emit('create-game');
            }
        });
    	
        $('#join_game').click(function() {
            var game_id = $('#game_id').val();
            if (game_id) {
                app.io.emit('join-game', game_id);
            }

        });
    	
    	$('#start_game').click(function() {
            app.io.emit('start-game');
    	});


        // listen global events
        
        $(document).bind('registered', function(event, data) {
            console.log('registered:', data);

            app.game.player_id = data.client_id;
            app.game.player_name = data.client_name;

            $('#player_name').parent().removeClass('hide');
            $.tmpl('Welcome ${name}', {name:app.player_name}).prependTo('.registered');
            $('.registered').removeClass('hide');
        });

        $(document).bind('game-created', function(event, data) {
            console.log('game-created:', data);

            app.game.id = data.game_id;
            app.game.topology = data.topology;
            app.game.player_names = [app.game.player_name];

            $("#playerListTemplate").tmpl({player_names:app.game.player_names}).appendTo($("#game div").empty());
            $('#game').removeClass('hide');
            $('#init_form').addClass('hide');
        });

        $(document).bind('game-joined', function(event, data) {
            console.log('game-joined:', data.game_id);

            app.game.id = data.game_id;
            app.game.topology = data.topology;
            app.game.player_names = data.player_names;

            $("#playerListTemplate").tmpl({player_names:app.game.player_names}).appendTo($("#game div").empty());

            $('#game').removeClass('hide');
            $('#init_form').addClass('hide');
        });

        $(document).bind('game-started', function(event, data) {
            console.log('game-started:', data);

            app.drawer.init($('#canvas')[0], app.game.topology, app.game.player_names);
            
            start_key_tracking();
        });

        $(document).bind('game-status', function(event, data) {
            app.game.update(data);
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
	
})(SnakeJS || {}, jQuery);
