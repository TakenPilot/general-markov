(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports.Matrix = require('./lib/matrix');
module.exports.Chain = require('./lib/chain');
module.exports.Tokenizer = require('./lib/tokenizer');
},{"./lib/chain":2,"./lib/matrix":3,"./lib/tokenizer":4}],2:[function(require,module,exports){
var Matrix = require('./matrix');

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
   * @param a
   * @param b
   * @param decimalPlaces
   * @returns {boolean}
   */
  function chartEqualWithin(a, b, decimalPlaces) {
    var rowKeys = Object.keys(a);
    for(var i = 0; i < rowKeys.length; i++) {
      for(var j = 0; j < rowKeys.length; j++) {
        if (!Matrix.equalWithin(a[rowKeys[i]][rowKeys[j]],  b[rowKeys[i]][rowKeys[j]], decimalPlaces)) {
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
  constructor.chartEqualWithin = chartEqualWithin;
  return constructor;
})();

module.exports = Chain;
},{"./matrix":3}],3:[function(require,module,exports){
var Matrix = (function () {

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
   * @constructs
   */
  var constructor = function () {};
  //instance
  constructor.prototype = {};
  //static
  constructor.getSum = getSum;
  constructor.getAverage = getAverage;
  constructor.normalize = normalize;
  constructor.equalWithin = equalWithin;
  return constructor;
})();

module.exports = Matrix;
},{}],4:[function(require,module,exports){
var Tokenizer = (function () {
  var defaults = {
    separator: / /
  };

  function readBuffer(options) {
    var last = '',
      trailingData = '',
      regex = options.separator || defaults.separator;

    function addToChart(chart, last, token) {
      if (!chart[last]) {
        chart[last] = {};
      }
      if (!chart[last][token]) {
        chart[last][token] = 1;
      } else {
        chart[last][token] += 1;
      }
    }

    return function(str, chart, isEnd) {
      chart = chart || {};
      var match, token, index,
        lastIndex = 0,
        lastMatchLength = 0;

      var separator = new RegExp(regex.source, 'g' +
        (regex.ignoreCase ? 'i' : '') +
        (regex.multiline ? 'm' : '') +
        (regex.sticky ? 'y' : ''));

      str = trailingData + str;

      while(match = separator.exec(str)) {
        index = match.index;
        token = str.substring(lastIndex + lastMatchLength, index);
        if (token.length > 0) {
          if (last.length > 0) {
            addToChart(chart, last, token);
          }
          last = token;
        }
        lastIndex = index;
        lastMatchLength = match[0] && match[0].length || 0;
      }

      trailingData = str.substr(lastIndex + lastMatchLength);
      if (!!isEnd && trailingData.length > 0) {
        addToChart(chart, last, trailingData);
        trailingData = '';
      }
      return chart;
    }
  }

  /**
   * @constructs
   */
  var constructor = function (options) {
    this.options = options || {};
    this.trailingData = '';
  };
  //instance
  constructor.prototype = {
    readStream: function (stream, cb) {
      var chart = {},
        read = readBuffer(this.options);

      stream.on('error', function (err) {
        cb(err);
      });
      stream.on('data', function (data) {
        read(data.toString(), chart);
      });
      stream.on('end', function () {
        read('', chart, true);
        cb(null, chart);
      });

    },
    readString: function (str) {
      var chart = {};
      readBuffer(this.options)(str, chart, true);
      return chart;
    }
  };
  //static
  constructor.Defaults = {
    'Words': {
      separator: /\W/
    },
    'Whitespace': {
      separator: /\S/
    }
  };
  return constructor;
})();

module.exports = Tokenizer;
},{}]},{},[1]);
