var snakes = require('../snakes.js');

describe("player", function() {

	beforeEach(function() {
	});

	it("you can create a player with an id and a name", function() {
		var player = snakes.createPlayer(1, 'john');
		expect(player.getId()).toEqual(1);
		expect(player.getName()).toEqual('john');
	});
});
