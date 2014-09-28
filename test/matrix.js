var expect = require('chai').expect,
  Matrix = require('../.').Matrix;

describe('Matrix', function () {
  it('normalize is correct with small numbers', function () {
    expect(Matrix.getAverage([1, 2, 3, 4, 5])).to.equal(3);
  });

  it('normalize is correct with small numbers', function () {
    expect(Matrix.getSum(Matrix.normalize([1, 2, 3, 4, 5]))).to.equal(1);
  });

  it('normalize is correct with large numbers', function () {
    expect(Matrix.getSum(Matrix.normalize([5000, 2, 111111, 3000, 1121212]))).to.equal(1);
  });
});