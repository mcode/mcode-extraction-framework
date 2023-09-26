const { ifAllArgsObj, ifSomeArgsObj } = require('../helpers/templateUtils');
const { coding, reference } = require('./snippets');

function periodTemplate({ startDate, endDate }) {
  return {
    period: {
      ...(startDate && { start: startDate }),
      ...(endDate && { end: endDate }),
    },
  };
}

function classTemplate({ classCode, classSystem }) {
  return {
    class: { ...coding({ code: classCode, system: classSystem }) },
  };
}

function typeTemplate({ typeCode, typeSystem }) {
  return {
    type: [{ coding: [coding({ code: typeCode, system: typeSystem })] }],
  };
}

function subjectTemplate({ subject }) {
  return {
    subject: reference({ ...subject, resourceType: 'Patient' }),
  };
}

function encounterTemplate({
  subject, id, status, classCode, classSystem, typeCode, typeSystem, startDate, endDate,
}) {
  if (!(id && subject && status && classCode && classSystem)) {
    throw Error('Trying to render a EncounterTemplate, but a required argument is missing; ensure that id, subject, status, classCode, and classSystem are all present');
  }

  return {
    resourceType: 'Encounter',
    id,
    status,
    ...classTemplate({ classCode, classSystem }),
    ...subjectTemplate({ subject }),
    ...ifAllArgsObj(typeTemplate)({ typeCode, typeSystem }),
    ...ifSomeArgsObj(periodTemplate)({ startDate, endDate }),
  };
}

module.exports = {
  encounterTemplate,
};
