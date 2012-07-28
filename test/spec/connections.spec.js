var chai = require('chai'),
	expect = require('chai').expect,
	spies = require('chai-spies');

var io = require('socket.io-client');

var basedir = '../../';
var server = require(basedir + 'server.js');

var socketURL = 'http://0.0.0.0:5000';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

describe("[connections]", function() {

	var client;

	beforeEach(function() {
		client = io.connect(socketURL, options);
	});

	it("a client can register itself with a name", function(done) {
		client.on('registered', function(user) {
			expect(user.name).to.be.equal('john');
			client.disconnect();
			done();
		});
		
	
		client.emit('register', {name:'john'});
		
	});

	it("a registered client can create a new game");

	it("a registered client can join a not full game");

	it("when a client join a game, other gamers are notified");

	it("a game creator can start it");

	it("a game joiner can't start it");

	it("a client can send commands to the game");

	it("a client receive game status");
});