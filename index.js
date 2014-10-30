var stream = require('stream');
var util = require('util');
var iterator = require('object-iterator');

module.exports = Stringify

util.inherits(Stringify, stream.Readable);
function Stringify (subject) {
  if(!(this instanceof Stringify)) return new Stringify(subject);

  stream.Readable.call(this);

  if (typeof subject === 'undefined') {
    throw new Error('no object to stringify');
  }

  this.state = 'start';

  if(subject && subject.toJSON) subject = subject.toJSON();
  this.iterator = iterator(subject);

  this._read = read;
}

function read (size) {
  var stringify = this;
  var iterator = stringify.iterator;
  var state = stringify.state;
  var current = iterator();
  if(current.type === 'object') {
    stringify.push(JSON.stringify({}));
  }
  else {
    stringify.push(JSON.stringify(current.value));
  }
  stringify.push();
}
