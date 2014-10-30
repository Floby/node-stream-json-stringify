module.exports = stringify

function stringify (subject) {
  if (!subject) {
    throw new Error('no object to stringify');
  }
  subject.toJSON();
}
