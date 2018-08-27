const microtime = require('microtime')
var stream = require('stream');
var util = require('util');
var ObjectIterator = require('object-iterator');

module.exports = Stringify

const MAX_TICKS = 100

util.inherits(Stringify, stream.Readable);
function Stringify (subject, options) {
  if(!(this instanceof Stringify)) return new Stringify(subject, options);

  stream.Readable.call(this, options);

  if (typeof subject === 'undefined') {
    throw new Error('no object to stringify');
  }

  if(subject && subject.toJSON) subject = subject.toJSON();
  const serializer = serialize(subject)

  this._read = (size) => {
    const start = microtime.now()
    let next
    let length = 0
    let ticks = 0
    while (!next || !next.done) {
      ticks++
      next = serializer.next()
      if (!next.done) {
        length += next.value.length
        const overrun = !this.push(next.value)
        if (length >= size || overrun) {
          break
        }
      }
      if (ticks >= MAX_TICKS) break;
    }
    if (next.done) {
      this.push(null)
    }
    const end = microtime.now()
    //console.log('duration', end - start)
  }
}

function* serialize (source) {
  const indentation = []
  for (let token of ObjectIterator(source)) {
    switch (token.type) {
      case 'object':
        yield* commaIfNeeded(indentation)
        yield* keyIfNeeded(token)
        indentation.unshift(true)
        yield '{'
        break;
      case 'end-object':
        yield '}'
        indentation.shift()
        break
      case 'array':
        yield* commaIfNeeded(indentation)
        yield* keyIfNeeded(token)
        indentation.unshift(true)
        yield '['
        break
      case 'end-array':
        yield ']'
        indentation.shift()
        break
      case 'function':
        break
      default:
        yield* commaIfNeeded(indentation)
        yield* keyIfNeeded(token)
        yield JSON.stringify(token.value)
    }
  }

  function* commaIfNeeded (indentation) {
    if (indentation.length && !indentation[0]) {
      yield ','
    }
    indentation[0] = false
  }

  function* keyIfNeeded (token) {
    if (typeof token.key === 'string') {
      yield JSON.stringify(token.key) + ':'
    }
  }
}
