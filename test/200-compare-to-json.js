var stream = require('stream');
var sink = require('stream-sink');
var expect = require('chai').expect

var stringify = require('..');

describe('stringify', function () {
  describe('given null', compares(null));
  describe('given a number', compares(8));
  describe('given a string', compares('Hello World'));
  describe('given true', compares(true));
  describe('given false', compares(false));
});


function compares (subject) {
  var json = JSON.stringify(subject);
  return function describe () {
    it('behaves the same as JSON.stringify', function (done) {
      stringify(subject).pipe(sink()).on('data', function(data) {
        expect(data).to.equal(json);
        done();
      });
    });
  }
}
