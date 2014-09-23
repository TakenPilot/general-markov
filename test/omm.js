var expect = require('chai').expect,
  Chain = require('../.');

describe('getProbabilityOf', function (){

  var chart = {
    'a': {'a': 0.2, 'b': 0.65, 'c': 0.15},
    'b': {'a': 0.1, 'b': 0.8, 'c': 0.1},
    'c': {'a': 0.7, 'b': 0.25, 'c': 0.05}
  };

  var chain;

  beforeEach(function () {
    chain = new Chain(chart);
  });

  it('fails correctly', function () {
    expect(function () { chain.getProbabilityOf('a', 'b', 'd') }).to.throw(Error);
  });

  it('example 1', function () {
    expect(chain.getProbabilityOf('a', 'b', 'c')).to.equal(chart.a.b * chart.b.c);
  });

  it('example 2', function () {
    expect(chain.getProbabilityOf('c', 'a', 'b')).to.equal(chart.c.a * chart.a.b);
  });
});

describe('getProbabilityFromTo', function () {
  var chart = {
    'a': {'a': 0.2, 'b': 0.65, 'c': 0.15},
    'b': {'a': 0.1, 'b': 0.8, 'c': 0.1},
    'c': {'a': 0.7, 'b': 0.25, 'c': 0.05}
  };

  beforeEach(function () {
    chain = new Chain(chart);
  });

  var chain;

  it('example 1', function () {
    expect(chain.getProbabilityFromTo('c', 'a', 2)).to.equal(chart.c.a);
  });

  it('example 2', function () {
    expect(chain.getProbabilityFromTo('c', 'a', 3)).to.equal(
      chart.c.a*chart.a.a +
      chart.c.b*chart.b.a +
      chart.c.c*chart.c.a
    );
  });
});

describe('permutations', function () {
  var chain;

  beforeEach(function () {
    chain = new Chain();
  });

  it('2', function () {
    expect(chain.getPermutations('a', 'b')).to.be.length(4);
  });

  it('3', function () {
    expect(chain.getPermutations('a', 'b', 'c')).to.be.length(27);
  });

  it('4', function () {
    expect(chain.getPermutations('a', 'b', 'c', 'd')).to.be.length(256);
  });

  it('5', function () {
    expect(chain.getPermutations('a', 'b', 'c', 'd', 'e')).to.be.length(3125);
  });

  it('6', function () {
    expect(chain.getPermutations('a', 'b', 'c', 'd', 'e', 'f')).to.be.length(46656);
  });

  it('permutations vs counting 2', function () {
    expect(chain.getPermutationsByConcatenation('a', 'b')).to.deep.equal(chain.getPermutationsByCounting('a', 'b'));
  });

  it('permutations vs counting 3', function () {
    expect(chain.getPermutationsByConcatenation('a', 'b', 'c')).to.deep.equal(chain.getPermutationsByCounting('a', 'b', 'c'));
  });

  it('permutations vs counting 4', function () {
    expect(chain.getPermutationsByConcatenation('a', 'b', 'c', 'd')).to.deep.equal(chain.getPermutationsByCounting('a', 'b', 'c', 'd'));
  });

  it('permutations vs counting 5', function () {
    expect(chain.getPermutationsByConcatenation('a', 'b', 'c', 'd', 'f')).to.deep.equal(chain.getPermutationsByCounting('a', 'b', 'c', 'd', 'f'));
  });
});