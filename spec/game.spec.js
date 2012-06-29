var snakes = require('../snakes.js');

describe("player", function() {

	beforeEach(function() {
	});

	it("you can create a player with an id and a name", function() {
		var player = snakes.createPlayer(1, 'john');
		expect(player.getId()).toEqual(1);
		expect(player.getName()).toEqual('john');
	});
	
	it("the snake can turn left or right  (default direction = UP)", function() {
		var player = snakes.createPlayer(1, 'john');
		
		expect(player.getDirection()).toEqual(snakes.DIRECTIONS.UP);
		
		// turn left
		player.turn(snakes.DIRECTIONS.LEFT);
		expect(player.getDirection()).toEqual(snakes.DIRECTIONS.LEFT);
		
		player.turn(snakes.DIRECTIONS.LEFT);
		expect(player.getDirection()).toEqual(snakes.DIRECTIONS.BOTTOM);
		
		player.turn(snakes.DIRECTIONS.LEFT);
		expect(player.getDirection()).toEqual(snakes.DIRECTIONS.RIGHT);
		
		player.turn(snakes.DIRECTIONS.LEFT);
		expect(player.getDirection()).toEqual(snakes.DIRECTIONS.UP);
		
		// turn right
		player.turn(snakes.DIRECTIONS.RIGHT);
		expect(player.getDirection()).toEqual(snakes.DIRECTIONS.RIGHT);
		
		player.turn(snakes.DIRECTIONS.RIGHT);
		expect(player.getDirection()).toEqual(snakes.DIRECTIONS.BOTTOM);
		
		player.turn(snakes.DIRECTIONS.RIGHT);
		expect(player.getDirection()).toEqual(snakes.DIRECTIONS.LEFT);
		
		player.turn(snakes.DIRECTIONS.RIGHT);
		expect(player.getDirection()).toEqual(snakes.DIRECTIONS.UP);
		
	});
	
	it("the snake has a head position", function() {
		var player = snakes.createPlayer(1, 'john');

		player.moveTo([1, 2]);
		expect(player.getHeadPosition()).toEqual([1, 2]);
	});
	
});
