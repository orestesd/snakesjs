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

});

describe("[starting a game and adding players]", function() {
	
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

	it("a full game doesn't accept more players", function() {

		for (var i = 1; i <= game.getMaxPlayers(); i++) {
			var player = snakes.createPlayer(i, 'player_' + i);
			game.addPlayer(player);
		};

		expect(game.getPlayers()).to.have.length(game.getMaxPlayers());		
		game.addPlayer(snakes.createPlayer(-1, 'not_added_player'));
		expect(game.getPlayers()).to.have.length(game.getMaxPlayers())
	});

	it("a game can't be started until the num of players added has reached the min num of players", function() {

		for (var i = 0; i < game.getMinPlayers() - 1; i++) {
			var player = snakes.createPlayer(i, 'player_' + i);
			game.addPlayer(player);
		};

		game.start();
		expect(game.isStarted()).to.be.false;
	});

	it("when the game is started, the world is initialized", function() {
		var world_init_spy = chai.spy(world.init);
		world.init = world_init_spy;

		game.addPlayer(snakes.createPlayer(1, 'john'));
		game.start();

		expect(world_init_spy).to.have.been.called.once;
	});

	it("if the game is already started, start it again is actionless", function() {
		var world_init_spy = chai.spy(world.init);
		world.init = world_init_spy;

		game.addPlayer(snakes.createPlayer(1, 'john'));
		game.start();
		game.start();

		expect(world.init).to.be.spy;
		expect(world_init_spy).to.have.been.called.once;
	});

	it("the game return the current status", function() {
		var player_a = snakes.createPlayer(1, 'john');
		var player_b = snakes.createPlayer(2, 'paul');

		game.addPlayer(player_a);
		game.addPlayer(player_b);

		var status = game.getStatus();
		expect(status.players).to.have.length(2);
		expect(status.players[0].positions).to.deep.equal(player_a.getPositions());

	});
});


describe("[running a game]", function() {
	
	it("an started game can be step runned", function() {
		expect(game.getAge()).to.be.equal(0);
		game.addPlayer(snakes.createPlayer(1, 'john'));
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
	
	var player_a, player_b;

	beforeEach(function() {
		player_a = snakes.createPlayer(1, 'john');
		player_b = snakes.createPlayer(2, 'paul');
		game.addPlayer(player_a);
		game.addPlayer(player_b);
	});

	it("an started game pipes commands to world players", function() {
		var spy = chai.spy(player_a.turn);
		player_a.turn = spy;

		game.start();
		game.command({player:1, dir:snakes.DIRECTIONS.LEFT});

		expect(spy).to.have.been.called.once;

	});

	it("a not started game does't pipes commands to world players", function() {
		var spy = chai.spy(player_a.turn);
		player_a.turn = spy;

		game.command({player:1, dir:snakes.DIRECTIONS.LEFT});

		expect(spy).not.to.have.been.called.once;
	});

	it("a unexistent player id in a command don't fail", function() {
		game.start();
		game.command({player:0, dir:snakes.DIRECTIONS.LEFT});

	});

});
