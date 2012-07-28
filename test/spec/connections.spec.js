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

describe("[connections]", function() {

	var client_a, client_b;

	beforeEach(function() {
		client_a = io.connect(socketURL, options);
	});

	it("a client can register itself with a name", function(done) {
		client_a.on('registered', function(user) {
			expect(user.name).to.be.equal('john');
			client_a.disconnect();
			done();
		});
	
		client_a.emit('register', {name:'john'});
		
	});

	it("a registered client can create a new game", function(done) {
		client_a.on('registered', function(user) {
			client_a.emit('create-game');
		});
		
		client_a.on('game-created', function(data) {
			expect(data.gameid).to.be.defined;

			var game = server.getGame(data.gameid);
			expect(game.id).equal(data.gameid);

			client_a.disconnect();
			done();
		});

		client_a.emit('register', {name:'john'});
	});

	it("a unregistered client can't create a new game", function(done) {
		
		client_a.on('game-created', function(game) {
			expect(true).to.be.false;
			client_a.disconnect();
			done();
		});

		client_a.on('error', function(error) {
			expect(error.msg).to.be.defined;
			client_a.disconnect();
			done();
		});

		client_a.emit('create-game');
	});

	it("a registered client can join a not full game");

	it("a registered client can't join a full game");

	it("when a client join a game, clients in same game are notified");

	it("when a client join a game, clients in different game aren't notified");

	it("a game creator can start it");

	it("a game joiner can't start it");

	it("a client can send commands to the game");

	it("all client receive game status");
});

