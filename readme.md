General Markov
-----

Helper library to perform operations on Observable Markov Models (OMMs).  Markov chains are really useful.

Can be used from node or the browser.

[![Build Status](https://travis-ci.org/TakenPilot/general-markov.svg?branch=master)](https://travis-ci.org/TakenPilot/general-markov)

[![Code Climate](https://codeclimate.com/github/TakenPilot/general-markov/badges/gpa.svg)](https://codeclimate.com/github/TakenPilot/general-markov)

[![Coverage Status](https://coveralls.io/repos/TakenPilot/general-markov/badge.png?branch=master)](https://coveralls.io/r/TakenPilot/general-markov?branch=master)

[![Dependencies](https://david-dm.org/TakenPilot/general-markov.svg?style=flat)](https://david-dm.org/TakenPilot/general-markov.svg?style=flat)

[![NPM version](https://badge.fury.io/js/general-markov.svg)](http://badge.fury.io/js/general-markov)

Editorial:  I actually use this library for some projects, so there are touches that make it more practical than most. For 
example, charts have names for the columns because the order really doesn't matter.  Names are also useful to link up 
to other math models or to real events.  It much more practical to link the click event to a column actually named 'click' 
rather than row and column 7. I could have used a look up table, but then I'm wrapping my math in more math.

Warning:  I haven't got the speed requirements up to where they should be yet.  Using these for AI is only useful for
time steps up to 10.  If you're doing more than that, you should probably be trying to calculate the limit/isotope of a
particular outcome instead.  I talk more about that in the examples below.

#markov.Chain

Create an instance of a Chain with a transition chart to calculate the probabilities of states.

##Example 1

```JavaScript

var chart = {
  'a': {'a': 0.2, 'b': 0.65, 'c': 0.15},
  'b': {'a': 0.1, 'b': 0.8, 'c': 0.1},
  'c': {'a': 0.7, 'b': 0.25, 'c': 0.05}
};

chain = new Chain(chart);
chain.getProbabilityOf('a', 'b');  //0.65  65%
chain.getProbabilityOf('a', 'b', 'a'); //0.065  6.5%
chain.getProbabilityOf('a', 'b', 'c', 'a'); //0.0455  4.55%

```

##Example 2

In this example, we're walking through each possibility between start to end, which moves 
toward an isotope. The isotope forms because we're adding all the possible paths between start 
and end.  Since we can move between all of them, the start and end points matter less as we add more steps.

```JavaScript

chain.getProbabilityFromTo('c', 'a', 1); //0.7
chain.getProbabilityFromTo('c', 'a', 2); //0.19999999999999998  20%
chain.getProbabilityFromTo('c', 'a', 3); //0.19949999999999998  19%
chain.getProbabilityFromTo('c', 'a', 4); //0.18197499999999997  18%
chain.getProbabilityFromTo('c', 'a', 5); //0.18197499999999997  18%
chain.getProbabilityFromTo('c', 'a', 6); //0.18197499999999997  18%

chain.getProbabilityFromTo('a', 'b', 1); //0.65
chain.getProbabilityFromTo('a', 'b', 2); //0.6875
chain.getProbabilityFromTo('a', 'b', 3); //0.712125
chain.getProbabilityFromTo('a', 'b', 4); //0.7146687500000002  71.5%
chain.getProbabilityFromTo('a', 'b', 5); //0.7146687500000002  71.5%
chain.getProbabilityFromTo('a', 'b', 6); //0.7146687500000002  71.5%
chain.getProbabilityFromTo('a', 'b', 7); //0.7146687500000002  71.5%

```

##Following the example from Wikipedia

```JavaScript

// with a transition matrix like this:
var transition = {
  'bull market': {
    'bull market': 0.9, 
    'bear market': 0.075, 
    'stagnant market': 0.025
  },
  'bear market': {
    'bull market': 0.15, 
    'bear market': 0.8, 
    'stagnant market': 0.05
  },
  'stagnant market': {
    'bull market': 0.25, 
    'bear market': 0.25, 
    'stagnant market': 0.5
  }
};

// three time periods later, we should get this:
var threeTimePeriodsLater = {
  'bull market': {
    'bull market': 0.7745, 
    'bear market': 0.17875, 
    'stagnant market': 0.04675
  },
  'bear market': {
    'bull market': 0.3575, 
    'bear market': 0.56825, 
    'stagnant market': 0.07425
  },
  'stagnant market': {
    'bull market': 0.4675, 
    'bear market': 0.37125, 
    'stagnant market': 0.16125
  }
};

var chain = new Chain(transition),
    ticks = 3;

// calculate!
var result = {
  'bull market': {
    'bull market': 
      chain.getProbabilityFromTo('bull market', 'bull market', ticks),
    'bear market': 
      chain.getProbabilityFromTo('bull market', 'bear market', ticks),
    'stagnant market': 
      chain.getProbabilityFromTo('bull market', 'stagnant market', ticks)
  },
  'bear market': {
    'bull market': 
      chain.getProbabilityFromTo('bear market', 'bull market', ticks),
    'bear market': 
      chain.getProbabilityFromTo('bear market', 'bear market', ticks),
    'stagnant market': 
      chain.getProbabilityFromTo('bear market', 'stagnant market', ticks)
  },
  'stagnant market': {
    'bull market': 
      chain.getProbabilityFromTo('stagnant market', 'bull market', ticks),
    'bear market': 
      chain.getProbabilityFromTo('stagnant market', 'bear market', ticks),
    'stagnant market': 
      chain.getProbabilityFromTo('stagnant market', 'stagnant market', ticks)
  }
};

// the expected result and our result are equal
// expected result is rounded to 5 decimal places, so we have to round as well
expect(Chain.chartEqualWithin(result, threeTimePeriodsLater, 5)).to.be.true; 
  
```

#markov.Tokenizer

Creating transition charts by hand is annoying, so here is a useful tool to do it for you.  Give the tokenizer your
separator as regex and a string (or a stream), and it will count each state transition between tokens and put the
totals into a chart.  This is useful for importing files, database results, or network requests, and it is optimized
for loading large data-sets, as long as you can hold the resulting chart in memory.

It does not normalize the transition chart. Data often comes from multiple sources, so we need to wait until 
we're done gathering information.  When all state transitions have been counted, then you can normalize the data.

##Example of importing data into a chart

```JavaScript

var tokenizer = new Tokenizer({separator: /\W/});  
var chart = tokenizer.readString('beep beep boop'); //give string

console.log(chart);  // outputs {"beep": { "beep": 1, "boop": 1 }}

```

##Another example of importing data into a chart

```JavaScript

var mock = new MockReadable(['beep beep boop']);
var tokenizer = new Tokenizer({separator: /\W/});  //divide by whitespace
tokenizer.readStream(mock, function (err, chart) {
  console.log(chart); // outputs {"beep": { "beep": 1, "boop": 1 }}
});

```

##Normalization

```JavaScript

var markov = require('general-markov');

var stream = new MockReadable(['beep beep boop']);
var tokenizer = new markov.Tokenizer(Tokenizer.Defaults.Words);
tokenizer.readStream(stream, function (err, result) {
  var chain = new markov.Chain(result).normalize();
  console.log(chain.transitions); // {"beep": { "beep": 0.5, "boop": 0.5 }}
});

```

##To DO

* Add support for Hidden Markov Models
* Add support for ANOVAs to look for better data to use as columns
* Add support for more matrix math