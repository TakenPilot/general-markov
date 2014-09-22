var expect = require('chai').expect,
  Chain = require('../.');

describe('three step', function (){

  var chart = {
    'a': {'a': 0.2, 'b': 0.65, 'c': 0.15},
    'b': {'a': 0.1, 'b': 0.8, 'c': 0.1},
    'c': {'a': 0.7, 'b': 0.25, 'c': 0.05}
  };

  var combinations = {
    '2': [
      [ 'a', 'a' ],
      [ 'a', 'b' ],
      [ 'b', 'a' ],
      [ 'b', 'b' ]
    ],
    '3':  [
      [ 'a', 'a', 'a' ],
      [ 'a', 'a', 'b' ],
      [ 'a', 'a', 'c' ],
      [ 'a', 'b', 'a' ],
      [ 'a', 'b', 'b' ],
      [ 'a', 'b', 'c' ],
      [ 'a', 'c', 'a' ],
      [ 'a', 'c', 'b' ],
      [ 'a', 'c', 'c' ],
      [ 'b', 'a', 'a' ],
      [ 'b', 'a', 'b' ],
      [ 'b', 'a', 'c' ],
      [ 'b', 'b', 'a' ],
      [ 'b', 'b', 'b' ],
      [ 'b', 'b', 'c' ],
      [ 'b', 'c', 'a' ],
      [ 'b', 'c', 'b' ],
      [ 'b', 'c', 'c' ],
      [ 'c', 'a', 'a' ],
      [ 'c', 'a', 'b' ],
      [ 'c', 'a', 'c' ],
      [ 'c', 'b', 'a' ],
      [ 'c', 'b', 'b' ],
      [ 'c', 'b', 'c' ],
      [ 'c', 'c', 'a' ],
      [ 'c', 'c', 'b' ],
      [ 'c', 'c', 'c' ]
    ]
  };

  var chain;

  beforeEach(function () {

  })

  it('fails correctly', function () {
    chain = new Chain(chart);

    expect(function () { chain.getProbabilityOf('a', 'b', 'd') }).to.throw(Error);
  });

  it('example 1', function () {
    chain = new Chain(chart);

    expect(chain.getProbabilityOf('a', 'b', 'c')).to.equal(chart.a.b * chart.b.c);
  });

  it('example 1', function () {
    chain = new Chain(chart);

    expect(chain.getProbabilityOf('c', 'a', 'b')).to.equal(chart.c.a * chart.a.b);
  });

});

describe('combinations', function () {
  var chain;

  beforeEach(function () {
    chain = new Chain();
  });

  it('2', function () {
    expect(chain.getCombinations('a', 'b')).to.be.length(4);
  });

  it('3', function () {
    expect(chain.getCombinations('a', 'b', 'c')).to.be.length(27);
  });

  it('4', function () {
    expect(chain.getCombinations('a', 'b', 'c', 'd')).to.be.length(256);
  });

  it('5', function () {
    expect(chain.getCombinations('a', 'b', 'c', 'd', 'e')).to.be.length(3125);
  });

  it('6', function () {
    expect(chain.getCombinations('a', 'b', 'c', 'd', 'e', 'f')).to.be.length(46656);
  });

  it('combinations vs counting 2', function () {
    expect(chain.getCombinationsByConcatenation('a', 'b')).to.deep.equal(chain.getCombinationsByCounting('a', 'b'));
  });

  it('combinations vs counting 3', function () {
    expect(chain.getCombinationsByConcatenation('a', 'b', 'c')).to.deep.equal(chain.getCombinationsByCounting('a', 'b', 'c'));
  });

  it('combinations vs counting 4', function () {
    expect(chain.getCombinationsByConcatenation('a', 'b', 'c', 'd')).to.deep.equal(chain.getCombinationsByCounting('a', 'b', 'c', 'd'));
  });

  it('combinations vs counting 5', function () {
    expect(chain.getCombinationsByConcatenation('a', 'b', 'c', 'd', 'f')).to.deep.equal(chain.getCombinationsByCounting('a', 'b', 'c', 'd', 'f'));
  });

});