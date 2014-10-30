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
  
  var buffer = []
  var current;
  while (current = iterator()){
    switch(current.type) {
      case 'object':
        buffer.push('{');
        break;
      case 'end-object':
        buffer.push('}');
        break;
      case 'array':
        buffer.push('[');
        break;
      case 'end-array':
        buffer.push(']');
        break;
      default:
        buffer.push(JSON.stringify(current.value))
        break
    }
  }
  stringify.push(buffer.join(''));
  if(!current) stringify.push();
}
