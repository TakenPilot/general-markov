var Chain = (function () {

  function getProbabilityOf() {
    var i,
      chart = this.chart,
      result = 1;

    for(i = 1; i < arguments.length; i++) {
      if (chart[arguments[i]] === undefined) {
        throw new Error('Argument ' + i + ' does not exist in chain data: ' + arguments[i]);
      }
    }

    for(i = 1; i < arguments.length; i++) {
      result *= chart[arguments[i-1]][arguments[i]];
    }
    return result;
  }

  function getCombinationsByCounting() {
    var i, j, q,
      args = Array.prototype.slice.apply(arguments),
      length = Math.pow(args.length, args.length),
      result = [];

    for(i = 0; i < length; i++) {
      q = [];
      for(j = 0; j < args.length; j++) {
        q.unshift(args[Math.floor(i / Math.pow(args.length, j)) % args.length]);
      }
      result.push(q);
    }
    return result;
  }

  function getCombinationsByConcatenation() {
    var i, current,
      args = Array.prototype.slice.apply(arguments),
      argsLength = args.length,
      q = [],
      result = [];

    for(i = 0; i < args.length; i++ ) {
      q.push([args[i]]);
    }

    while(q.length) {
      current = q.shift();
      if (current.length < args.length) {
        for(i = 0; i < args.length; i++ ) {
          q.push(current.concat([args[i]]));
        }
      } else {
        result.push(current);
      }
    }

    console.log(result.length);

    return result;
  }

  var constructor = function (chart) {
    this.chart = chart;
  };
  constructor.prototype = {

    getCombinationsByCounting: getCombinationsByCounting,
    getCombinationsByConcatenation: getCombinationsByConcatenation,
    getCombinations: getCombinationsByConcatenation,
    getProbabilityOf: getProbabilityOf
  };
  return constructor;
})();

module.exports = Chain;