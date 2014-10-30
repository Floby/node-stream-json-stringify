var stream = require('stream');
var util = require('util');

module.exports = Stringify

util.inherits(Stringify, stream.Readable);
function Stringify (subject) {
  if(!(this instanceof Stringify)) return new Stringify(subject);

  stream.Readable.call(this);

  if (!subject) {
    throw new Error('no object to stringify');
  }

  if(subject.hasOwnProperty('toJSON')) {
    subject = subject.toJSON();
  }
}
