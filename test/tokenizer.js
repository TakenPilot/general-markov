var util = require('util'),
  expect = require('chai').expect,
  Readable = require('stream').Readable,
  Tokenizer = require('../.').Tokenizer;

var MockReadable = (function () {
  var constructor = function (strArray, opt) {
    this.strArray = strArray;
    Readable.call(this, opt);
  };
  util.inherits(constructor, Readable);
  constructor.prototype._read = function () {
    if (this.strArray.length) {
      var str = this.strArray.shift();
      if (typeof str === 'string') {
        this.push(new Buffer(str));
      } else {
        this.emit('error', new Error(str));
      }
    } else {
      this.push(null);
    }
  };
  return constructor;
})();


describe('Tokenizer', function () {
  it('can read from a string (Default.Words)', function () {
    var tokenizer = new Tokenizer(Tokenizer.Defaults.Words);
    expect(tokenizer.readString('a b! b a? a b a. b:a;   a  b')).to.deep.equal({
      "a": {"a": 2, "b": 4 },
      "b": { "a": 3, "b": 1}
    });
  });

  it('can read from a string (Default.Whitespace)', function () {
    var tokenizer = new Tokenizer(Tokenizer.Defaults.Whitespace);
    expect(tokenizer.readString('a b! b a? a b a. b:a;   a  b')).to.deep.equal({
      " ": {" ": 6,"   ": 1},
      "   ": {"  ": 1}
    });
  });

  it('can read from a stream (single chunk)', function (done) {
    var stream = new MockReadable(['beep beep boop']);
    var tokenizer = new Tokenizer(Tokenizer.Defaults.Words);
    tokenizer.readStream(stream, function (err, result) {
      expect(result).to.deep.equal({"beep": { "beep": 1, "boop": 1 }});
      done();
    });
  });

  it('can read from a stream (2 chunks)', function (done) {
    var stream = new MockReadable(['beep be', 'ep boop']);
    var tokenizer = new Tokenizer(Tokenizer.Defaults.Words);
    tokenizer.readStream(stream, function (err, result) {
      expect(result).to.deep.equal({"beep": { "beep": 1, "boop": 1 }});
      done();
    });
  });

  it('can read from a stream (3 chunks)', function (done) {
    var stream = new MockReadable(['beep be', 'ep boo', 'p']);
    var tokenizer = new Tokenizer(Tokenizer.Defaults.Words);
    tokenizer.readStream(stream, function (err, result) {
      expect(result).to.deep.equal({"beep": { "beep": 1, "boop": 1 }});
      done();
    });
  });

  it('can error from a stream (3 chunks)', function (done) {
    var stream = new MockReadable(['beep be', 'ep boo', 7]);
    var tokenizer = new Tokenizer(Tokenizer.Defaults.Words);
    tokenizer.readStream(stream, function (err) {
      expect(err).to.be.instanceof(Error);
      done();
    });
  });

  it('can read from a stream and normalize', function (done) {
    var Chain = require('../.').Chain;
    var stream = new MockReadable(['beep beep boop']);
    var tokenizer = new Tokenizer(Tokenizer.Defaults.Words);
    tokenizer.readStream(stream, function (err, result) {
      var chain = new Chain(result).normalize();
      expect(chain.transitions).to.deep.equal({"beep": { "beep": 0.5, "boop": 0.5 }});
      done();
    });
  });
});

