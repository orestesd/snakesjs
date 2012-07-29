var chai = require('chai'),
	expect = require('chai').expect,
	spies = require('chai-spies'), 
	io = require('socket.io-client');

var basedir = '../../';
var server = require(basedir + 'server.js');

var socketURL = 'http://0.0.0.0:5000';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

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
			expect(user.name).to.be.equal('john');
			done();
		});
	
		client.emit('register', {name:'john'});
		
	});

	it("a registered client can create a new game", function(done) {
		client.on('registered', function(user) {
			client.emit('create-game');
		});
		
		client.on('game-created', function(data) {
			expect(data.gameid).to.not.be.undefined;

			var game = server.getGame(data.gameid);
			expect(game.id).equal(data.gameid);

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

			var game = server.getGame(data.gameid);

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
			game_id = data.gameid;
			client_b.emit('join-game', game_id);
		});

		client_b.on('game-joined', function(data) {
			expect(game_id).to.be.equal(data.gameid);

			var game = server.getGame(data.gameid);
			expect(game.getPlayer(client_a.id)).to.not.be.undefined;

			done();
		});

		client_a.emit('create-game');
	});

	it("when a client join a game, clients in same game are notified and receive current players names", function(done) {
		var game_id;

		client_a.on('game-created', function(data) {
			game_id = data.gameid;
			client_b.emit('join-game', game_id);
		});

		client_a.on('game-joined', function(data) {
			expect(game_id).to.be.equal(data.gameid);
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
			client_b.emit('join-game', data.gameid);
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
			game_id = data.gameid;
			client_a.emit('start-game');
		});

		client_a.on('game-started', function(data) {
			var game = server.getGame(game_id);
			expect(game.isStarted()).to.be.ok;
			done();
		});

		client_a.emit('create-game');
	});

	it("a game joiner can't start it", function(done){
		var game_id;

		client_a.on('game-created', function(data) {
			game_id = data.gameid;
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
			game_id = data.gameid;
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

	it("a client can send commands to the game");

	it("all client receive game status");

});