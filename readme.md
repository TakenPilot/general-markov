Chain
-----

##API

###Example

```JavaScript

var chart = {
    'a': {'a': 0.2, 'b': 0.65, 'c': 0.15},
    'b': {'a': 0.1, 'b': 0.8, 'c': 0.1},
    'c': {'a': 0.7, 'b': 0.25, 'c': 0.05}
  };
  
  chain = new Chain(chart);
  
  
  //distinct path
  
  chain.getProbabilityOf('a', 'b');  //0.65  65%
  chain.getProbabilityOf('a', 'b', 'a'); //0.065  6.5%
  chain.getProbabilityOf('a', 'b', 'c', 'a'); //0.0455  4.55%
  
  
  //start to end, number of steps known
  // This is fun, because we're walking through each possibility between start to end, which moves toward an isotope.
  // The isotope forms because we're adding all the possible paths between start and end assuming we can move between
  // all of them.  Since we always have 100% probability of reaching all of them between start and end, the larger the
  // number of steps, the closer we get to the original matrix, and the less the start and end points matter.
  
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

