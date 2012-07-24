var expect = require('chai').expect;

var basedir = '../../';
var snakes = require(basedir + 'snakes.js');
var topologies = require(basedir + 'topologies.js');
var gamejs = require(basedir + 'game.js');

describe("world", function() {
	
	var game, topo, world;

	beforeEach(function() {
		topo = topologies.getAll().walled;
		world = snakes.createWorld(topo);
	});

	it("a game is initialized with a world", function() {
		var game = gamejs.createGame(world);
		expect(game.getWorld()).not.to.be.undefined
	});

	it("an initialized game has an id", function() {
		var game = gamejs.createGame(world);
		expect(game.getId()).not.to.be.undefined
	});
});