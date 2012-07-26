var chai = require('chai'),
	expect = require('chai').expect,
	spies = require('chai-spies');

var basedir = '../../';
var snakes = require(basedir + 'snakes.js');
var topologies = require(basedir + 'topologies.js');

before(function() {
	chai.use(spies);
});

describe("[player]", function() {
	var player;
	
	beforeEach(function() {
		player = snakes.createPlayer(1, 'john');
	});

	it("you can create a player with an id and a name", function() {
		expect(player.getId()).to.equal(1);
		expect(player.getName()).to.equal('john');
	});
	
	it("the snake can turn left or right  (default direction = UP)", function() {
		expect(player.getDirection()).to.equal(snakes.DIRECTIONS.UP);
		
		// turn left
		player.turn(snakes.DIRECTIONS.LEFT);
		expect(player.getDirection()).to.equal(snakes.DIRECTIONS.LEFT);
		
		player.turn(snakes.DIRECTIONS.LEFT);
		expect(player.getDirection()).to.equal(snakes.DIRECTIONS.BOTTOM);
		
		player.turn(snakes.DIRECTIONS.LEFT);
		expect(player.getDirection()).to.equal(snakes.DIRECTIONS.RIGHT);
		
		player.turn(snakes.DIRECTIONS.LEFT);
		expect(player.getDirection()).to.equal(snakes.DIRECTIONS.UP);
		
		// turn right
		player.turn(snakes.DIRECTIONS.RIGHT);
		expect(player.getDirection()).to.equal(snakes.DIRECTIONS.RIGHT);
		
		player.turn(snakes.DIRECTIONS.RIGHT);
		expect(player.getDirection()).to.equal(snakes.DIRECTIONS.BOTTOM);
		
		player.turn(snakes.DIRECTIONS.RIGHT);
		expect(player.getDirection()).to.equal(snakes.DIRECTIONS.LEFT);
		
		player.turn(snakes.DIRECTIONS.RIGHT);
		expect(player.getDirection()).to.equal(snakes.DIRECTIONS.UP);
		
	});
	
	it("the snake has a head position", function() {
		player.moveTo([1, 2]);
		expect(player.getHeadPosition()).to.deep.equal([1, 2]);
	});

	it("the snake can move step by step and the body follow the head", function() {
		expect(player.getTailSize()).to.equal(5);
		expect(player.getPositions().length).to.equal(0);
		
        player.moveTo([1, 2]);
        player.moveTo([1, 3]);
        player.moveTo([1, 4]);
        player.moveTo([1, 5]);
        player.moveTo([1, 6]);
        player.moveTo([1, 7]);
        
		expect(player.getHeadPosition()).to.deep.equal([1, 7]);
		expect(player.getPositions().length).to.equal(5);
		expect(player.getPositions()[0]).to.deep.equal([1, 3]);

		// move to the same position is not a move
        player.moveTo([1, 7]);
		expect(player.getPositions().length).to.equal(5);
		expect(player.getPositions()[0]).to.deep.equal([1, 3]);
	});	

	it("the snake's tail size can grow, shrink and reset", function() {
		expect(player.getTailSize()).to.equal(5);
		player.grow(3);
		expect(player.getTailSize()).to.equal(8);
		player.grow(-5);
		expect(player.getTailSize()).to.equal(3);

		player.moveTo([1, 2]);
        player.moveTo([1, 3]);
        player.moveTo([1, 4]);
        player.moveTo([1, 5]);

		expect(player.getPositions().length).to.equal(3);
		expect(player.getPositions()[0]).to.deep.equal([1,3]);

		player.grow(1);
		player.moveTo([1, 6]);
        expect(player.getPositions().length).to.equal(4);
        expect(player.getPositions()[0]).to.deep.equal([1,3]);

		player.grow(-2);
		player.moveTo([1, 7]);
		expect(player.getPositions().length).to.equal(2);
        player.moveTo([1, 5]);

		player.resetTailSize();
		expect(player.getTailSize()).to.equal(5);
	});

});

describe("[world]", function() {
	var topo, world;
		
	beforeEach(function() {
		topo = topologies.getAll().walled;
		world = snakes.createWorld(topo);
	});
		
	it("world size is calculated ok from a topology", function() {
		expect(world.getSize().h).to.equal(topo.grid.length);
		expect(world.getSize().w).to.equal(topo.grid[0].length);
	});
	
	it("world can return the type of the position x,y", function() {
		expect(world.getTile([0,1])).to.equal(snakes.TILE_TYPES.WALL);
		expect(world.getTile([3,11])).to.equal(snakes.TILE_TYPES.WALL);
		expect(world.getTile([1,2])).to.equal(snakes.TILE_TYPES.EMPTY);
	});

	describe("[world handles player moves]", function() {

		var player_a, player_b;
	
		beforeEach(function() {
			player_a = snakes.createPlayer(1, 'john');
			player_b = snakes.createPlayer(2, 'paul');

			world.init([player_a, player_b]);
		});

		it("world can return a player", function() {
			expect(world.getPlayer(1)).to.deep.equal(player_a);
		});

		it("world places players in their initial positions", function() {
			expect(player_a.getHeadPosition()).to.deep.equal([6,6]);
			expect(player_b.getHeadPosition()).to.deep.equal([6,34]);
		});
		
		it("word moveAll moves all players", function() {
			var spy_world = chai.spy(world.move);
			var spy_player_a = chai.spy(player_a.moveTo);
			var spy_player_b = chai.spy(player_b.moveTo);
			world.move = spy_world;
			player_a.moveTo = spy_player_a;
			player_b.moveTo = spy_player_b;

			world.init([player_a, player_b]);

			world.moveAll();
			expect(spy_world).to.have.been.called.twice;
			expect(spy_player_a).to.have.been.called.once;
			expect(spy_player_b).to.have.been.called.once;
		});

		it("the world can move a player based in his direction", function() {
			player_a.grow(-4)
			world.init([player_a, player_b]);
			
			// player's position [6,6] and player's direction is up
			world.move(player_a);
			expect(player_a.getHeadPosition()).to.deep.equal([5,6]);
			
			player_a.turn(snakes.DIRECTIONS.RIGHT);
			world.move(player_a);
			expect(player_a.getHeadPosition()).to.deep.equal([5,7]);
			
			player_a.turn(snakes.DIRECTIONS.RIGHT);
			world.move(player_a);
			expect(player_a.getHeadPosition()).to.deep.equal([6,7]);
			
			player_a.turn(snakes.DIRECTIONS.RIGHT);
			world.move(player_a);
			expect(player_a.getHeadPosition()).to.deep.equal([6,6]);
		});
		
		it("if the player hits a wall, he won't be moved", function() {
			// player's direction is up
			player_a.setHeadPosition([1,2]);
			world.move(player_a);
			expect(player_a.getHeadPosition()).to.deep.equal([1,2]);
		});
		
		it("if the player hits another snake, he won't be moved", function() {
			player_a.setHeadPosition([3,2]);
			player_b.setHeadPosition([3,3]);
			
			player_b.turn(snakes.DIRECTIONS.LEFT);
			world.move(player_b);

			expect(player_b.getHeadPosition()).to.deep.equal([3,3]);
			
		});

		it("if the player hits a wall X consecutive steps, the player will dead", function() {
			// player's direction is up
			player_a.setHeadPosition([1,2]);

			for (var i = 0; i < player_a.getMaxLife(); i++) {
				expect(player_a.isDead()).to.equal(false);
				world.move(player_a);
			};
			
			expect(player_a.isDead()).to.equal(true);
		});

		it("the world place items", function() {
			var items = world.putItems();
			expect(items.length).to.equal(5);

			for (var i = 0; items < items.length; i++) {
				var it = items[i];
				expect(it.pos[0]).toBeLessThan(world.getSize().h)
				expect(it.pos[1]).toBeLessThan(world.getSize().w)
			};
		});
	});

});

describe("[item]", function() {
	
	var player;
	
	beforeEach(function() {
		player = snakes.createPlayer(1, 'john');
	});

	it("if the player eats a item, the item action is performed", function() {
		var item = snakes.items[0];
		var spy = chai.spy(item.action);
		item.action = spy;

		player.feed(item);

		expect(item.action).to.be.spy;
		expect(spy).to.have.been.called;

	});

	it("item grow", function() {
		var item = snakes.items[0];
		expect(item.name).to.equal('grow');

		expect(player.getTailSize()).to.equal(5);
		player.feed(item);
		expect(player.getTailSize()).to.equal(7);
	});

	it("item shrink", function() {
		var item = snakes.items[1];
		expect(item.name).to.equal('shrink');

		expect(player.getTailSize()).to.equal(5);
		player.feed(item);
		expect(player.getTailSize()).to.equal(3);
	});
});
