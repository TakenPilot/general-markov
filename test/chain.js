var expect = require('chai').expect,
  Chain = require('../.').Chain,
  Matrix = require('../.').Matrix;

describe('Chain', function () {


  describe('basic math', function () {
    var chart = {
      'a': {'a': 0.2, 'b': 0.65, 'c': 0.15},
      'b': {'a': 0.1, 'b': 0.8, 'c': 0.1},
      'c': {'a': 0.7, 'b': 0.25, 'c': 0.05}
    };

    var chain;

    it('isRowNormalized is correct', function () {
      chain = new Chain(chart);
      expect(chain.isRowNormalized('a')).to.be.true;
      expect(chain.isRowNormalized('b')).to.be.true;
      expect(chain.isRowNormalized('c')).to.be.true;
    });

    it('getColumnSum is correct', function () {
      chain = new Chain(chart);
      expect(chain.getColumnSum('a')).to.equal(1);
      expect(chain.getColumnSum('b')).to.equal(1.7000000000000002);
      expect(chain.getColumnSum('c')).to.equal(0.3);
    });

    it('getColumnAverage is correct', function () {
      chain = new Chain(chart);
      expect(
          chain.getColumnAverage('a') +
          chain.getColumnAverage('b') +
          chain.getColumnAverage('c')
      ).to.be.within(0.99999999, 1.000000001);
    });
  });

  describe('Wikipedia stock market example', function () {
    var transition = {
      'bull market': {'bull market': 0.9, 'bear market': 0.075, 'stagnant market': 0.025},
      'bear market': {'bull market': 0.15, 'bear market': 0.8, 'stagnant market': 0.05},
      'stagnant market': {'bull market': 0.25, 'bear market': 0.25, 'stagnant market': 0.5}
    };

    var threeTimePeriodsLater = {
      'bull market': {'bull market': 0.7745, 'bear market': 0.17875, 'stagnant market': 0.04675},
      'bear market': {'bull market': 0.3575, 'bear market': 0.56825, 'stagnant market': 0.07425},
      'stagnant market': {'bull market': 0.4675, 'bear market': 0.37125, 'stagnant market': 0.16125}
    };

    it('rows are normalized', function () {
      var chain = new Chain(transition);
      expect(chain.isRowNormalized('bull market')).to.be.true;
      expect(chain.isRowNormalized('bear market')).to.be.true;
      expect(chain.isRowNormalized('stagnant market')).to.be.true;
    });

    it('getColumnAverage is correctly averaged and thus sums to 1', function () {
      var chain = new Chain(transition);
      expect(
          chain.getColumnAverage('bull market') +
          chain.getColumnAverage('bear market') +
          chain.getColumnAverage('stagnant market')
      ).to.be.within(0.99999999, 1.000000001);
    });

    it('Three time periods later matches example results', function () {

      var chain = new Chain(transition),
        timePeriods = 3;

      var result = {
        'bull market': {
          'bull market': chain.getProbabilityFromTo('bull market', 'bull market', timePeriods),
          'bear market': chain.getProbabilityFromTo('bull market', 'bear market', timePeriods),
          'stagnant market': chain.getProbabilityFromTo('bull market', 'stagnant market', timePeriods)
        },
        'bear market': {
          'bull market': chain.getProbabilityFromTo('bear market', 'bull market', timePeriods),
          'bear market': chain.getProbabilityFromTo('bear market', 'bear market', timePeriods),
          'stagnant market': chain.getProbabilityFromTo('bear market', 'stagnant market', timePeriods)
        },
        'stagnant market': {
          'bull market': chain.getProbabilityFromTo('stagnant market', 'bull market', timePeriods),
          'bear market': chain.getProbabilityFromTo('stagnant market', 'bear market', timePeriods),
          'stagnant market': chain.getProbabilityFromTo('stagnant market', 'stagnant market', timePeriods)
        }
      };
      expect(Chain.chartEqualWithin(result, threeTimePeriodsLater, 5)).to.be.true;
    });

    it('Five time periods later does not match example results', function () {

      var chain = new Chain(transition),
        timePeriods = 5;

      var result = {
        'bull market': {
          'bull market': chain.getProbabilityFromTo('bull market', 'bull market', timePeriods),
          'bear market': chain.getProbabilityFromTo('bull market', 'bear market', timePeriods),
          'stagnant market': chain.getProbabilityFromTo('bull market', 'stagnant market', timePeriods)
        },
        'bear market': {
          'bull market': chain.getProbabilityFromTo('bear market', 'bull market', timePeriods),
          'bear market': chain.getProbabilityFromTo('bear market', 'bear market', timePeriods),
          'stagnant market': chain.getProbabilityFromTo('bear market', 'stagnant market', timePeriods)
        },
        'stagnant market': {
          'bull market': chain.getProbabilityFromTo('stagnant market', 'bull market', timePeriods),
          'bear market': chain.getProbabilityFromTo('stagnant market', 'bear market', timePeriods),
          'stagnant market': chain.getProbabilityFromTo('stagnant market', 'stagnant market', timePeriods)
        }
      };
      expect(Chain.chartEqualWithin(result, threeTimePeriodsLater, 5)).to.be.false;
    });
  });

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
      expect(chain.getProbabilityFromTo('c', 'a', 1)).to.equal(chart.c.a);
    });

    it('example 2', function () {
      expect(chain.getProbabilityFromTo('c', 'a', 2)).to.equal(
          chart.c.a*chart.a.a +
          chart.c.b*chart.b.a +
          chart.c.c*chart.c.a
      );
    });

    it('example 3', function () {
      expect(
          chain.getProbabilityOf('b', 'a')*chain.getProbabilityOf('a', 'a') +
          chain.getProbabilityOf('b', 'b')*chain.getProbabilityOf('b', 'a') +
          chain.getProbabilityOf('b', 'c')*chain.getProbabilityOf('c', 'a')
      ).to.equal(chain.getProbabilityFromTo('b', 'a', 2));
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

});
