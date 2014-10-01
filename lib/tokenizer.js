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