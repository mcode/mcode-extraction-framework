const { coding } = require('./coding');
const { valueX } = require('./valueX');
const { reference } = require('./reference');
const { meta, narrative } = require('./resource');
const { extensionArr, dataAbsentReasonExtension } = require('./extension');
const { effectiveX } = require('./effectiveX');
const { identifier, identifierArr } = require('./identifier');
const { bodySiteTemplate } = require('./bodySiteTemplate');
const { stagingMethodTemplate } = require('./cancerStaging');

module.exports = {
  bodySiteTemplate,
  coding,
  dataAbsentReasonExtension,
  effectiveX,
  extensionArr,
  identifier,
  identifierArr,
  meta,
  narrative,
  reference,
  stagingMethodTemplate,
  valueX,
};
