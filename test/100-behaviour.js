var stream = require('stream');
var sinon = require('sinon');
var expect = require('chai').expect
var assert = require('chai').assert

describe('stringify', function () {
  var stringify = require('..');

  describe('with no arguments', function () {
    it('throws', function () {
      expect(stringify).to.throw(/no object to stringify/i);
    });
  });

  describe('with an argument', function () {
    it('calls toJSON on it', function () {
      var subject = {toJSON: sinon.spy()}
      stringify(subject);
      assert(subject.toJSON.called, 'toJSON not called');
    });

    it('returns a readable stream', function () {
      var readable = stringify({});
      expect(readable).to.be.an.instanceof(stream.Readable);
    });
  });
});
