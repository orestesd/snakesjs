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
      width: 10,
      height: 12
    }

    $(canvas).width(square.width * getGridWidth()).height(square.height * getGridHeight());

    for (var i = 0; i < app.game.player_names.length; i++) {
      colors[app.game.player_names[i]] = COLORS[i + 1];
    };

    animationLoop();
  };

  var animationLoop = function() {
      
      if (app.game.getStatus())
        redraw();

      requestAnimationFrame(animationLoop);
  }

  var clear = function() {
    canvas.width = canvas.width;
  }

  var drawTile = function(position) {
    var offset = getOffset(position);
    context.fillRect(offset[1] + 1, offset[0] + 1, 
                     square.height - 1, square.width - 1);
  };

  var drawGrid = function() {
    context.fillStyle = COLORS[0];
    for (var y = 0; y < getGridHeight(); y++) {
      for (var x = 0; x < getGridWidth(); x++) {
        var type = grid[y][x];
        if (type === TILE_TYPES.WALL) {
          drawTile([y, x]);
        } 
      }
    }
  }

  var drawPlayer = function(player) {
    context.fillStyle = colors[player.name];
    for (var j = 0; j < player.positions.length; j++) {
      var position = player.positions[j];
  };

  var redraw = function() {
    clear();
    drawGrid();

    var players = app.game.getStatus().players;
    if (players) {
      for (var i = 0; i < players.length; i++) {
        drawPlayer(players[i])
      };
    }
  };

  var getOffset = function(position) {
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