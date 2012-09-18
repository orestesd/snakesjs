var chai = require('chai'),
	expect = require('chai').expect,
	sinon = require('sinon'),
	ioserver = require('socket.io').listen(5000);
	io = require('socket.io-client');

var basedir = '../../';
var gameio = require(basedir + 'gameio.js')(ioserver);
ioserver.set('log level', 2);

var socketURL = 'http://0.0.0.0:5000';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

var sandbox;

beforeEach(function() {
	sandbox = sinon.sandbox.create();
});

afterEach(function() {
	sandbox.restore();
});

describe("[single connections]", function() {

	var client;

	beforeEach(function() {
		client = io.connect(socketURL, options);
	});

	afterEach(function() {
		client.disconnect();
	});

	it("a client can register itself with a name", function(done) {
		client.on('registered', function(user) {
			expect(user.client_name).to.be.equal('john');
			done();
		});
	
		client.emit('register', {name:'john'});
		
	});

	it("a registered client can create a new game", function(done) {
		client.on('registered', function(user) {
			client.emit('create-game');
		});
		
		client.on('game-created', function(data) {
			expect(data.game_id).to.not.be.undefined;

			var game = gameio.getGame(data.game_id);
			expect(game.id).equal(data.game_id);

			done();
		});

		client.emit('register', {name:'john'});
	});

	it("a unregistered client can't create a new game", function(done) {
		
		client.on('game-created', function(game) {
			expect(true).to.be.false;
			done();
		});

		client.on('error', function(error) {
			expect(error.msg).to.not.be.undefined;
			done();
		});

		client.emit('create-game');
	});

	it("when a client creates a game, the client is added as a game player", function(done) {

		client.on('registered', function(user) {
			client.id = user.client_id;
			client.emit('create-game');
		});
		
		client.on('game-created', function(data) {

			var game = gameio.getGame(data.game_id);

			expect(game.getPlayer(client.id)).to.not.be.undefined;

			done();
		});

		client.emit('register', {name:'john'});
	});

});

describe("[multiple connections]", function() {
	
	var client_a, client_b;

	beforeEach(function(done) {
		client_a = io.connect(socketURL, options);
		client_b = io.connect(socketURL, options);

		client_a.emit('register', {name:'john'});
		client_b.emit('register', {name:'paul'});

		client_a.on('registered', function(user) {
			client_a.id = user.client_id;
		});

		client_b.on('registered', function(user) {
			client_b.id = user.client_id;
			done();
		});
	});

	afterEach(function() {
		client_a.disconnect();
		client_b.disconnect();
	});

	it("a registered client can join a not full game", function(done) {
		var game_id;

		client_a.on('game-created', function(data) {
			game_id = data.game_id;
			client_b.emit('join-game', game_id);
		});

		client_b.on('game-joined', function(data) {
			expect(game_id).to.be.equal(data.game_id);

			var game = gameio.getGame(data.game_id);
			expect(game.getPlayer(client_a.id)).to.not.be.undefined;

			done();
		});

		client_a.emit('create-game');
	});

	it("when a client join a game, clients in same game are notified and receive current players names", function(done) {
		var game_id;

		client_a.on('game-created', function(data) {
			game_id = data.game_id;
			client_b.emit('join-game', game_id);
		});

		client_a.on('game-joined', function(data) {
			expect(game_id).to.be.equal(data.game_id);
			expect(data.player_names).to.have.length(2);
			expect(data.player_names[0]).to.be.equal('john');

			done();
		});

		client_a.emit('create-game');
	});

	it("when a client join a game, clients in different game aren't notified", function(done) {
		var client_c = io.connect(socketURL, options);
		client_c.emit('register', {name:'george'});
		client_c.emit('create-game');

		client_a.on('game-created', function(data) {
			client_b.emit('join-game', data.game_id);
		});

		client_c.on('game-joined', function(data) {
			expect(true).to.be.false;
			done();
		});

		client_b.on('game-joined', function(data) {
			done();
		});

		client_a.emit('create-game');
	});

	it("a game creator can start it", function(done){
		var game_id;

		client_a.on('game-created', function(data) {
			game_id = data.game_id;
			client_a.emit('start-game');
		});

		client_a.on('game-started', function(data) {
			var game = gameio.getGame(game_id);
			expect(game.isStarted()).to.be.ok;
			done();
		});

		client_a.emit('create-game');
	});

	it("a game joiner can't start it", function(done){
		var game_id;

		client_a.on('game-created', function(data) {
			game_id = data.game_id;
			client_b.emit('join-game', game_id);
		});

		client_b.on('game-joined', function(data) {
			client_b.emit('start-game');
		});

		client_a.on('game-started', function(data) {
			expect(true).to.be.false;
			done();
		});

		client_b.on('error', function(error) {
			expect(error.msg).to.not.be.undefined;
			done();
		});

		client_a.emit('create-game');
	});

	it("a client can't join a started game", function(done){
		var game_id;

		client_a.on('game-created', function(data) {
			game_id = data.game_id;
			client_a.emit('start-game');
		});

		client_a.on('game-started', function(data) {
			client_b.emit('join-game', game_id);
		});

		client_b.on('game-joined', function(data) {
			expect(true).to.be.false;
			done();
		});

		client_b.on('error', function(error) {
			expect(error.msg).to.not.be.undefined;
			done();
		});

		client_a.emit('create-game');	
	});

	it("a client can send commands to the game", function(done){
		var game_id;

		var clock = sandbox.useFakeTimers();

		client_a.on('game-created', function(data) {
			game_id = data.game_id;
			client_a.emit('start-game');
		});
 
		client_a.on('game-started', function(data) {
			client_a.emit('command', {dir:3});
		});

		client_a.on('command-received', function(data) {
			var game = gameio.getGame(game_id);
			var player = game.getPlayer(client_a.id);

			sandbox.spy(player, 'turn');
			expect(player.getDirection()).to.be.equal(0);

			clock.tick(gameio.update_game_freq);
			expect(player.turn.calledOnce).to.be.ok;
			expect(player.getDirection()).to.be.equal(3);
			done();
		});

		client_a.emit('create-game');
	});

	it("the commands are executed one by one (for each client) in each game step", function(done) {
		var game_id;

		var clock = sandbox.useFakeTimers();

		client_a.on('game-created', function(data) {
			game_id = data.game_id;
			client_a.emit('start-game');
		});

		client_a.on('game-started', function(data) {
			client_a.emit('command', {dir:3});
			client_a.emit('command', {dir:3});
			client_a.emit('command', {dir:3});
		});

		var count = 0;
		client_a.on('command-received', function(data) {
			count += 1;
			if (count == 3) {
				var game = gameio.getGame(game_id);
				var player = game.getPlayer(client_a.id);

				sandbox.spy(player, 'turn');
				expect(player.getDirection()).to.be.equal(0);

				clock.tick(gameio.update_game_freq);
				expect(player.turn.calledOnce).to.be.ok;
				expect(player.getDirection()).to.be.equal(3);
				done();
			}
		});


		client_a.emit('create-game');
	});

	it("clients receive game status", function(done){
		var game_id;

		client_a.on('game-created', function(data) {
			game_id = data.game_id;
			client_b.emit('join-game', game_id);
		});

		client_b.on('game-joined', function(data) {
			client_a.emit('start-game');
		});

		client_b.on('game-status', function(data) {
			expect(game_id).to.be.equal(data.game_id);
			expect(data.players).to.have.length(2);
			done();
		});

		client_a.emit('create-game');
	});

});