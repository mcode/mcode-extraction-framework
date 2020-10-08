const { coding } = require('./coding');
const { valueCodeableConcept, valueX } = require('./valueX');
const { reference } = require('./reference');
const { meta, narrative } = require('./resource');
const { extensionArr } = require('./extensionArr');
const { effectiveX } = require('./effectiveX');
const { identifier, identifierArr } = require('./identifier');

module.exports = {
  coding,
  effectiveX,
  extensionArr,
  identifier,
  identifierArr,
  meta,
  narrative,
  reference,
  valueCodeableConcept,
  valueX,
};
