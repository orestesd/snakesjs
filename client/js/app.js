var SnakeJS = (function(app) {

    return {
		random: function (a, b) {
					return Math.round(Math.random()*(b-a)+a);
				}
	};
	
})(SnakeJS || {});
