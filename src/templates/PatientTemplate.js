const { dataAbsentReasonExtension, extensionArr, coding, valueX } = require('./snippets');
const { ifAllArgsObj, ifSomeArgsObj } = require('../helpers/templateUtils');

function mrnIdentifierTemplate({ mrn }) {
  return {
    identifier: [
      {
        type: {
          coding: [
            coding({
              system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
              code: 'MR',
              display: 'Medical Record Number',
            }),
          ],
          text: 'Medical Record Number',
        },
        system: 'http://example.com/system/mrn',
        value: mrn,
      },
    ],
  };
}

function usCoreRaceTemplate({ raceCodesystem, raceCode, raceText }) {
  return {
    extension: [
      {
        url: 'ombCategory',
        ...valueX({
          system: raceCodesystem,
          code: raceCode,
        }),
      },
      {
        url: 'text',
        ...valueX(raceText),
      },
    ],
    url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-race',
  };
}

function usCoreEthnicityTemplate({ ethnicityCode, ethnicityText }) {
  return {
    extension: [
      {
        url: 'ombCategory',
        ...valueX({
          system: 'urn:oid:2.16.840.1.113883.6.238',
          code: ethnicityCode,
        }),
      },
      {
        url: 'text',
        ...valueX(ethnicityText),
      },
    ],
    url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity',
  };
}

function usCoreBirthSexExtensionTemplate({ birthsex }) {
  return {
    url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex',
    valueCode: birthsex,
  };
}

function birthDateTemplate({ dateOfBirth }) {
  return {
    birthDate: dateOfBirth,
  };
}

function genderTemplate({ gender }) {
  if (!gender) {
    // gender is 1..1 in mCODE
    return {
      _gender: extensionArr(dataAbsentReasonExtension('unknown')),
    };
  }

  return {
    gender,
  };
}

function nameTemplate({ familyName, givenName }) {
  if (!familyName && !givenName) {
    // name is 1..* in mCODE
    return {
      name: [
        extensionArr(dataAbsentReasonExtension('unknown')),
      ],
    };
  }

  return {
    name: [
      {
        text: `${givenName} ${familyName}`,
        ...(familyName && { family: familyName }),
        ...(givenName && { given: givenName.split(' ') }),
      },
    ],
  };
}

function addressTemplate({ addressLine, city, state, zip }) {
  return {
    address: [
      {
        ...(addressLine && {
          line: [
            addressLine,
          ],
        }),
        ...(city && { city }),
        ...(state && { state }),
        ...(zip && { postalCode: zip }),
        country: 'US',
      },
    ],
  };
}

function languageTemplate({ language }) {
  return {
    communication: [
      {
        language: {
          coding: [
            coding({
              system: 'urn:ietf:bcp:47',
              code: language,
            }),
          ],
        },
      },
    ],
  };
}

// Based on http://hl7.org/fhir/us/mcode/StructureDefinition-mcode-cancer-patient.html
// Official url: http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-cancer-patient
function patientTemplate({
  id, mrn, familyName, givenName, gender, birthsex, dateOfBirth, language, addressLine, city, state, zip, raceCodesystem, raceCode, raceText, ethnicityCode, ethnicityText,
}) {
  if (!(id && mrn)) {
    throw Error('Trying to render a PatientTemplate, but a required argument is missing; ensure that id and mrn are both present');
  }
  return {
    resourceType: 'Patient',
    id,
    ...genderTemplate({ gender }),
    ...mrnIdentifierTemplate({ mrn }),
    ...nameTemplate({ familyName, givenName }),
    ...ifSomeArgsObj(addressTemplate)({ addressLine, city, state, zip }),
    ...ifAllArgsObj(birthDateTemplate)({ dateOfBirth }),
    ...ifAllArgsObj(languageTemplate)({ language }),
    ...extensionArr(
      ifAllArgsObj(usCoreRaceTemplate)({ raceCodesystem, raceCode, raceText }),
      ifAllArgsObj(usCoreEthnicityTemplate)({ ethnicityCode, ethnicityText }),
      ifAllArgsObj(usCoreBirthSexExtensionTemplate)({ birthsex }),
    ),
  };
}

module.exports = {
  patientTemplate,
};
