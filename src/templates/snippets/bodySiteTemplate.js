const { valueX } = require('./valueX');
const { coding } = require('./coding');
const { ifAllArgsObj } = require('../../helpers/templateUtils');

function lateralityTemplate({ laterality }) {
  return {
    extension: [
      {
        url: 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-laterality',
        ...valueX({ code: laterality, system: 'http://snomed.info/sct' }, 'valueCodeableConcept'),
      },
    ],
  };
}

function bodySiteTemplate({ bodySite, laterality }) {
  if (!bodySite) return null;

  return {
    bodySite: {
      ...ifAllArgsObj(lateralityTemplate)({ laterality }),
      coding: [coding({
        system: 'http://snomed.info/sct',
        code: bodySite,
      })],
    },
  };
}

module.exports = {
  bodySiteTemplate,
};
