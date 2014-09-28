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