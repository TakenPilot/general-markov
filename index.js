/**
 * @class
 */
var Chain = (function () {
  "use strict";

  //instance

  /**
   * @param from
   * @param to
   * @param steps
   * @returns {number}
   */
  function getProbabilityFromTo(from, to, steps) {
    var permutationSteps = steps - 1, //first step doesn't count
      choices = Object.keys(this.chart),
      permutations = this.getPermutationsWithLength(choices, permutationSteps),
      sum;

    if (permutations.length === 0) {
      sum = this.getProbabilityOf.apply(this, [from, to]);
    } else {
      sum = 0;
      for(var i = 0; i < permutations.length; i++) {
        var permutation = [from].concat(permutations[i]).concat([to]);
        sum += this.getProbabilityOf.apply(this, permutation);
      }
    }

    return sum;
  }

  /**
   * @returns {number}
   */
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

  /**
   * @returns {Array}
   */
  function getPermutationsByCounting() {
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

  /**
   * @param list
   * @param length
   * @returns {Array}
   */
  function getPermutationsByConcatenationWithLength(list, length) {
    if (length < 1) {
      return [];
    }

    var i, current,
      args = Array.prototype.slice.apply(list),
      //resultLength = Math.min(args.length, length),
      resultLength = length,
      q = [],
      result = [];

    for(i = 0; i < args.length; i++ ) {
      q.push([args[i]]);
    }

    while(q.length) {
      current = q.shift();
      if (current.length < resultLength) {
        for(i = 0; i < args.length; i++ ) {
          q.push(current.concat([args[i]]));
        }
      } else {
        result.push(current);
      }
    }

    return result;
  }

  /**
   * @returns {Array}
   */
  function getPermutationsByConcatenation() {
    return getPermutationsByConcatenationWithLength(arguments, arguments.length);
  }

  /**
   * @param rowName
   * @returns {boolean}
   */
  function isRowNormalized(rowName) {
    var sum = 0,
      row = this.chart[rowName],
      keys = Object.keys(row);
    for(var i = 0; i < keys.length; i++) {
      sum += row[keys[i]];
    }

    return sum === 1;
  }

  /**
   * @param columnName
   * @returns {number}
   */
  function getColumnSum(columnName) {
    var row, sum = 0,
      keys = Object.keys(this.chart);
    for(var i = 0; i < keys.length; i++) {
      row = this.chart[keys[i]];
      sum += row[columnName];
    }

    return sum;
  }

  /**
   * @param columnName
   * @returns {number}
   */
  function getColumnAverage(columnName) {
    return this.getColumnSum(columnName) / Object.keys(this.chart).length;
  }

  //static

  /**
   * @param list
   * @returns {number}
   */
  function getSum(list) {
    var result = 0;
    for(var i = 0; i < list.length; i++) {
      result += list[i];
    }
    return result;
  }

  /**
   * @param list
   * @returns {number}
   */
  function getAverage(list) {
    return getSum(list) / list.length;
  }

  /**
   * @param list
   * @returns {Array}
   */
  function normalize(list) {
    var sum = getSum(list);
    for(var i = 0; i < list.length; i++) {
      list[i] = list[i] / sum;
    }
    return list;
  }

  /**
   * @param a
   * @param b
   * @param decimalPlaces
   * @returns {boolean}
   */
  function equalWithin(a, b, decimalPlaces) {
    var digits = decimalPlaces * 10;
    return Math.round(a*digits) === Math.round(b*digits);
  }

  /**
   * @param a
   * @param b
   * @param decimalPlaces
   * @returns {boolean}
   */
  function chartEqualWithin(a, b, decimalPlaces) {
    var rowKeys = Object.keys(a);
    for(var i = 0; i < rowKeys.length; i++) {
      for(var j = 0; j < rowKeys.length; j++) {
        if (!equalWithin(a[rowKeys[i]][rowKeys[j]],  b[rowKeys[i]][rowKeys[j]], decimalPlaces)) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * @constructs
   * @param chart
   */
  var constructor = function (chart) {
    this.chart = chart;
  };
  //instance methods
  constructor.prototype = {
    getPermutationsByCounting: getPermutationsByCounting,
    getPermutationsByConcatenation: getPermutationsByConcatenation,
    getPermutations: getPermutationsByConcatenation,
    getPermutationsWithLength: getPermutationsByConcatenationWithLength,
    getProbabilityOf: getProbabilityOf,
    getProbabilityFromTo: getProbabilityFromTo,
    isRowNormalized: isRowNormalized,
    getColumnSum: getColumnSum,
    getColumnAverage: getColumnAverage
  };
  //static methods
  constructor.getAverage = getAverage;
  constructor.getSum = getSum;
  constructor.normalize = normalize;
  constructor.equalWithin = equalWithin;
  constructor.chartEqualWithin = chartEqualWithin;
  return constructor;
})();

module.exports = Chain;