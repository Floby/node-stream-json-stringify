var stream = require('stream');
var sink = require('stream-sink');
var expect = require('chai').expect

var stringify = require('..');

describe('stringify', function () {
  describe('given null', function () {
    compares(null);
  })
});


function compares (subject) {
  var json = JSON.stringify(subject);
  it('behaves the same as JSON.stringify', function (done) {
    stringify(subject).pipe(sink()).on('data', function(data) {
      expect(data).to.equal(json);
      done();
    });
  });
}
