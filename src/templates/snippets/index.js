const { coding } = require('./coding');
const { extension } = require('./extension');
const { valueCodeableConcept, valueX } = require('./valueX');
const { effectiveX } = require('./effectiveX');
const { reference } = require('./reference');
const { meta, narrative } = require('./resource');

module.exports = {
  coding,
  effectiveX,
  extension,
  meta,
  narrative,
  reference,
  valueCodeableConcept,
  valueX,
};
