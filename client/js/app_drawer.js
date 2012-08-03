SnakeJS.drawer = (function(app, $, undefined) {

  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||  
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  var TILE_TYPES = {EMPTY:0, WALL:1}
  var COLORS = ['rgb(220,220,220)', 'rgb(20,20,255)', 
                'rgb(255,20,20)',  'rgb(20,255,20)', 
                'rgb(255,255,20)', 'rgb(255,20,255)']


  var canvas, context, grid, square;

  var colors = {}
  var count = 0;

  var init = function(canv) {
    canvas = canv;
    context = canvas.getContext("2d");    
    grid = app.game.topology.grid;
    square = {
      width: 12,
      height: 12
    }

    $(canvas).width(square.width * getGridWidth()).height(square.height * getGridHeight());

    for (var i = 0; i < app.game.player_names.length; i++) {
      colors[app.game.player_names[i]] = COLORS[i] + 1;
    };

    animationLoop();
  };

  var animationLoop = function() {
      if (count++ > 500) return;
      requestAnimationFrame(animationLoop);
      if (app.game.getStatus())
        redraw();
  }

  var clear = function() {
    canvas.width = canvas.width;
  }

  var drawTile = function(position) {
    context.fillRect(position[1] * square.height + 1, 
                     position[0] * square.width + 1, 
                     square.height - 1, square.width - 1);
  };

  var drawGrid = function() {
    context.fillStyle = COLORS[0];
    for (var y = 0; y < getGridHeight(); y++) {
      for (var x = 0; x < getGridWidth(); x++) {
        var type = grid[y][x];
        if (type === TILE_TYPES.WALL) {
          console.log('drawing ', [y, x], context.fillStyle);
          drawTile([y, x]);
        } 
      }
    }
  }

  var drawPlayer = function(player) {
    context.fillStyle = colors[player.name];
    for (var j = 0; j < player.positions.length; j++) {
      var position = player.positions[j];
      drawTile(position);
    };
  };

  var redraw = function() {
    clear();
    //drawGrid();

    var players = app.game.getStatus().players;
    if (players) {
      for (var i = 0; i < players.length; i++) {
        drawPlayer(players[i])
      };
    }
  };

  var getPixel = function(position) {
    return [position[0] * square.width, position[1] * square.height] ;
  };

  var getGridHeight = function() {
    return grid.length;
  };
  
  var getGridWidth = function() {
    return grid[0].length;
  };

  return {
    init : init
  }

})(SnakeJS || {}, jQuery);