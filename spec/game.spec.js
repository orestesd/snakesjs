var snakes = require('../snakes.js');
var topologies = require('../topologies.js');

describe("player", function() {
	var player;
	
	beforeEach(function() {
		player = snakes.createPlayer(1, 'john');
	});

	it("you can create a player with an id and a name", function() {
		expect(player.getId()).toEqual(1);
		expect(player.getName()).toEqual('john');
	});
	
	it("the snake can turn left or right  (default direction = UP)", function() {
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
		player.moveTo([1, 2]);
		expect(player.getHeadPosition()).toEqual([1, 2]);
	});

	it("the snake can move step by step and the body follow the head", function() {
		expect(player.getTailSize()).toEqual(5);
		expect(player.getPositions().length).toEqual(0);
		
        player.moveTo([1, 2]);
        player.moveTo([1, 3]);
        player.moveTo([1, 4]);
        player.moveTo([1, 5]);
        player.moveTo([1, 6]);
        player.moveTo([1, 7]);
        
		expect(player.getHeadPosition()).toEqual([1, 7]);
		expect(player.getPositions().length).toEqual(5);
		expect(player.getPositions()[0]).toEqual([1, 3]);

		// move to the same position is not a move
        player.moveTo([1, 7]);
		expect(player.getPositions().length).toEqual(5);
		expect(player.getPositions()[0]).toEqual([1, 3]);
	});	

	it("the snake's tail size can grow, shrink and reset", function() {
		expect(player.getTailSize()).toEqual(5);
		player.grow(3);
		expect(player.getTailSize()).toEqual(8);
		player.grow(-5);
		expect(player.getTailSize()).toEqual(3);

		player.moveTo([1, 2]);
        player.moveTo([1, 3]);
        player.moveTo([1, 4]);
        player.moveTo([1, 5]);

		expect(player.getPositions().length).toEqual(3);
		expect(player.getPositions()[0]).toEqual([1,3]);

		player.grow(1);
		player.moveTo([1, 6]);
        expect(player.getPositions().length).toEqual(4);
        expect(player.getPositions()[0]).toEqual([1,3]);

		player.grow(-2);
		player.moveTo([1, 7]);
		expect(player.getPositions().length).toEqual(2);
        player.moveTo([1, 5]);

		player.resetTailSize();
		expect(player.getTailSize()).toEqual(5);
	});
	
});

describe("world", function() {
	var topo, world;
		
	beforeEach(function() {
		topo = topologies.getAll().walled;
		world = snakes.createWorld(topo);
	});
		
	it("world size is calculated ok from a topology", function() {
		expect(world.getSize().h).toEqual(topo.grid.length);
		expect(world.getSize().w).toEqual(topo.grid[0].length);
	});
	
	it("world can return the type of the position x,y", function() {
		expect(world.getTile([0,1])).toEqual(snakes.TILE_TYPES.WALL);
		expect(world.getTile([3,11])).toEqual(snakes.TILE_TYPES.WALL);
		expect(world.getTile([1,2])).toEqual(snakes.TILE_TYPES.EMPTY);
	});
	
	describe("world handles player moves", function() {

		var player_a, player_b;
	
		beforeEach(function() {
			player_a = snakes.createPlayer(1, 'john');
			player_b = snakes.createPlayer(2, 'paul');

			world.init([player_a, player_b]);
		});

		it("world places players in their initial positions", function() {
			expect(player_a.getHeadPosition()).toEqual([6,6]);
			expect(player_b.getHeadPosition()).toEqual([6,34]);
		});
		
		it("the world can move a player based in his direction", function() {
			player_a.grow(-4)
			world.init([player_a, player_b]);
			
			// player's position [6,6] and player's direction is up
			world.move(player_a);
			expect(player_a.getHeadPosition()).toEqual([5,6]);
			
			player_a.turn(snakes.DIRECTIONS.RIGHT);
			world.move(player_a);
			expect(player_a.getHeadPosition()).toEqual([5,7]);
			
			player_a.turn(snakes.DIRECTIONS.RIGHT);
			world.move(player_a);
			expect(player_a.getHeadPosition()).toEqual([6,7]);
			
			player_a.turn(snakes.DIRECTIONS.RIGHT);
			world.move(player_a);
			expect(player_a.getHeadPosition()).toEqual([6,6]);
		});
		
		it("if the player hits a wall, he won't be moved", function() {
			// player's direction is up
			player_a.setHeadPosition([1,2]);
			world.move(player_a);
			expect(player_a.getHeadPosition()).toEqual([1,2]);
		});
		
		it("if the player hits another snake, he won't be moved", function() {
			player_a.setHeadPosition([3,2]);
			player_b.setHeadPosition([3,3]);
			
			player_b.turn(snakes.DIRECTIONS.LEFT);
			world.move(player_b);

			expect(player_b.getHeadPosition()).toEqual([3,3]);
			
		});

		it("if the player hits a wall X consecutive steps, the player will dead", function() {
			// player's direction is up
			player_a.setHeadPosition([1,2]);

			for (var i = 0; i < player_a.getMaxLife(); i++) {
				expect(player_a.isDead()).toEqual(false);
				world.move(player_a);
			};
			
			expect(player_a.isDead()).toEqual(true);
		});
	});
});
