var chai = require('chai'),
	expect = require('chai').expect,
	spies = require('chai-spies');

var basedir = '../../';
var snakes = require(basedir + 'snakes.js');
var topologies = require(basedir + 'topologies.js');
var gamejs = require(basedir + 'game.js');

before(function() {
	chai.use(spies);
});

var game, topo, world;

beforeEach(function() {
	topo = topologies.getAll().walled;
	world = snakes.createWorld(topo);
	game = gamejs.createGame(world);
});


describe("[creating a game]", function() {
	
	it("a game is created with a world", function() {
		expect(game.getWorld()).exist
	});

	it("a game has an id", function() {
		expect(game.getId()).exist
	});	

});

describe("[starting a game]", function() {
	
	it("a game can be started", function() {
		game.start();
		expect(game.isStarted()).to.be.true;
	});


	it("a player can be added to a not started game", function() {
		var player_a = snakes.createPlayer(1, 'john');
		var player_b = snakes.createPlayer(2, 'paul');

		game.addPlayer(player_a);
		game.addPlayer(player_b);

		expect(game.getPlayers()).to.have.length(2)
	});

	it("a player can't be added to a started world", function() {
		var player_a = snakes.createPlayer(1, 'john');
		var player_b = snakes.createPlayer(2, 'paul');

		game.addPlayer(player_a);
		game.start();
		game.addPlayer(player_b);

		expect(game.getPlayers()).to.have.length(1)
	});

	it("when the game is started, the world is initialized", function() {
		var world_init_spy = chai.spy(world.init);
		world.init = world_init_spy;

		expect(world.init).to.be.spy;
		expect(world.init).to.be.spy;
		game.start();

		expect(world_init_spy).to.have.been.called.once;
	});

	it("if the game is already started, start it again is actionless", function() {
		var world_init_spy = chai.spy(world.init);
		world.init = world_init_spy;

		game.start();
		game.start();

		expect(world.init).to.be.spy;
		expect(world_init_spy).to.have.been.called.once;
	});
});


describe("[running a game]", function() {
	
	it("an started game can be step runned", function() {
		expect(game.getAge()).to.be.equal(0);
		game.start();
		game.step();
		expect(game.getAge()).to.be.equal(1);		
	});

	it("a not started game can't be step runned", function() {
		expect(game.getAge()).to.be.equal(0);
		game.step();
		expect(game.getAge()).to.be.equal(0);	
	});

	it("every game step, makes world moving", function() {
		var player_a = snakes.createPlayer(1, 'john');
		var player_b = snakes.createPlayer(2, 'paul');

		var world_move_spy = chai.spy(world.moveAll);
		world.moveAll = world_move_spy;

		game.addPlayer(player_a);
		game.addPlayer(player_b);
		game.start();
		
		game.step();
		expect(world_move_spy).to.have.been.called.once;

		game.step();
		expect(world_move_spy).to.have.been.called.twice;

	});
});


describe("[commands]", function() {
	
	beforeEach(function() {
	});

	it("an started game pipes commands to world players");

	it("a not started game does't pipes commands to world players");
});