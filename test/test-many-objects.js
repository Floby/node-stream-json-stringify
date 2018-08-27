const delay = require('delay')
const blocked = require('blocked-at')
var sink = require('stream-sink');
var expect = require('chai').expect
const PassThrough = require('stream').PassThrough

var stringify = require('..');

describe('When overrunning the high watermark', () => {
  it('behaves the same as JSON.stringify', () => {
    // Given
    const highWaterMark = 10
    const source = []
    const count = 100
    for (var i = 0; i < count; ++i) {
      source.push(i)
    }
    const expected = JSON.stringify(source)
    // When
    return stringify(source, { highWaterMark }).pipe(sink()).then((actual) => {
      // Then
      expect(actual).to.equal(expected)
    })
  })
})
