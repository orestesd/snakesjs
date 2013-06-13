SnakeJS.drawer = (function(app, $, undefined) {

  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||  
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  var TILE_TYPES = {EMPTY:0, WALL:1};
  var ITEM_COLORS = {'shrink':'rgb(255,160,255)', 'grow':'rgb(255,255,160)'}
  var COLORS = ['rgb(0,0,0)', 'rgb(20,20,255)', 
                'rgb(255,20,20)',  'rgb(20,255,20)', 
                'rgb(255,255,20)', 'rgb(255,20,255)']


  var canvas, context, grid, square, canvas_size;

  var colors = {}

  var init = function(canv) {
    canvas = canv;
    context = canvas.getContext("2d");    
    grid = app.game.topology.grid;
    square = {
      width: 18,
      height: 18
    }

    canvas_size = {width:square.width * getGridWidth(), height:square.height * getGridHeight()};

    $(canvas).width(canvas_size.width).height(canvas_size.height);

    for (var i = 0; i < app.game.player_names.length; i++) {
      colors[app.game.player_names[i]] = COLORS[i + 1];
    };

    animationLoop();
  };

  var stop = function() {
    animationLoop = function() {};
  };

  var animationLoop = function() {
      
      if (app.game.getStatus())
        redraw();

      requestAnimationFrame(animationLoop);
  }

  var clear = function() {
    canvas.width = canvas_size.width;
    canvas.height = canvas_size.height;
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
      drawTile(position);
    };
  };

  var drawItem = function(item) {
    if (!item.eaten) {
      context.fillStyle = ITEM_COLORS[item.name];
      drawTile(item.position);
    }
  };

  var redraw = function() {
    clear();
    drawGrid();

    var items = app.game.getStatus().items;
    if (items) {
      for (var i = 0; i < items.length; i++) {
        drawItem(items[i])
      };
    }

    var players = app.game.getStatus().players;
    if (players) {
      for (var i = 0; i < players.length; i++) {
        var player = players[i];
        drawPlayer(player);
        if (player.dead) {
          app.events.raise_global('player-dead', player);  
        }
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
    init : init,
    stop : stop
  }

})(SnakeJS || {}, jQuery);
