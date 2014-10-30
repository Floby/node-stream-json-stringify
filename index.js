var stream = require('stream');
var util = require('util');
var iterator = require('object-iterator');

module.exports = Stringify

util.inherits(Stringify, stream.Readable);
function Stringify (subject) {
  if(!(this instanceof Stringify)) return new Stringify(subject);
  this._maxTicks = 50;

  stream.Readable.call(this);

  if (typeof subject === 'undefined') {
    throw new Error('no object to stringify');
  }
  this.state = {
    nested: 0,
    first: {}
  }

  if(subject && subject.toJSON) subject = subject.toJSON();
  this.iterator = iterator(subject);

  this._read = read;
}

function read (size) {
  var stringify = this;
  var iterator = stringify.iterator;
  var state = stringify.state;
  var shouldPush, toPush, current;
  var length = 0;
  var ticksLeft = this._maxTicks;
  
  current = iterator();
  shouldPush = true;
  while (shouldPush && current) {
    toPush = null;
    switch(current.type) {
      case 'object':
        toPush = commaIfNeeded(state) + keyIfNeeded(state, current) + '{';
        ++state.nested;
        state.first[state.nested] = true;
        break;
      case 'end-object':
        toPush = '}';
        --state.nested;
        break;
      case 'array':
        toPush = commaIfNeeded(state) + '[';
        ++state.nested;
        state.first[state.nested] = true;
        break;
      case 'end-array':
        toPush = ']'
        --state.nested;
        break;
      default:
        toPush = commaIfNeeded(state) + keyIfNeeded(state, current) + JSON.stringify(current.value);
        break
    }
    length += toPush.length;
    shouldPush = stringify.push(toPush);
    shouldPush = shouldPush && (length < size);
    if(--ticksLeft === 0) break;
    current = iterator();
  }
  if(!current) stringify.push();
}

function commaIfNeeded (state) {
  var toReturn = '';
  if(state.nested && !state.first[state.nested]) {
    toReturn = ',';
  }
  state.first[state.nested] = false;
  return toReturn;
}

function keyIfNeeded (state, current) {
  if(typeof current.key === 'string') {
    return JSON.stringify(current.key) + ':'
  }
  return '';
}
