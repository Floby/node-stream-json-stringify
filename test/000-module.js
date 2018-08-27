var expect = require('chai').expect

describe('stringify', function () {
  it('is requirable', function () {
    require('..')
  })
  it('is a function', function () {
    expect(require('..')).to.be.a('function')
  })
})
