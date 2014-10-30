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


  if(subject && subject.toJSON) subject = subject.toJSON();
  this.iterator = iterator(subject);

  this._read = read;
}

function read (size) {
  var stringify = this;
  var iterator = stringify.iterator;
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
        break;
      case 'end-array':
        toPush = ']'
        break;
      default:
        toPush = JSON.stringify(current.value);
        break
    }
    shouldPush = stringify.push(toPush);
    current = iterator();
  }
  if(!current) stringify.push();
}
