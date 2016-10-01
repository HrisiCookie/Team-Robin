mocha.setup('bdd');

const {expect, assert} = chai;

describe('Testing test', function() {
	it('expect sum(1) to equal 1', function() {
		expect(1).to.equal(1);
	})
});

mocha.run();
