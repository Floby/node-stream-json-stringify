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
  this.state = {}

  if(subject && subject.toJSON) subject = subject.toJSON();
  this.iterator = iterator(subject);

  this._read = read;
}

function read (size) {
  var stringify = this;
  var iterator = stringify.iterator;
  var state = stringify.state;
  var shouldPush, toPush, current;
  
  current = iterator();
  shouldPush = true;
  while (shouldPush && current) {
    toPush = null;
    switch(current.type) {
      case 'object':
        toPush = '{'
        break;
      case 'end-object':
        toPush = '}';
        break;
      case 'array':
        toPush = '['
        state.inArray = true;
        state.firstInArray = true;
        break;
      case 'end-array':
        toPush = ']'
        state.inArray = false;
        state.firstInArray = false;
        break;
      default:
        toPush = JSON.stringify(current.value);
        break
    }
    if(current.type !== 'array' && state.inArray && !state.firstInArray) {
      toPush = ',' + toPush;
    }
    shouldPush = stringify.push(toPush);
    if(current.type !== 'array' && state.inArray && state.firstInArray) {
      state.firstInArray = false;
    }
    current = iterator();
  }
  if(!current) stringify.push();
}
