/* eslint-disable no-underscore-dangle */
const fhirpath = require('fhirpath');
const crypto = require('crypto');
const { extensionArr, dataAbsentReasonExtension } = require('../templates/snippets/extension.js');

// Based on the OMB Ethnicity table found here:http://hl7.org/fhir/us/core/STU3.1/ValueSet-omb-ethnicity-category.html
const ethnicityCodeToDisplay = {
  '2135-2': 'Hispanic or Latino',
  '2186-5': 'Non Hispanic or Latino',
};

/**
 * Converts code in OMB Ethnicity to Text Value
 * @param {string} code, coded ethinicity value from the above table
 * @return {string} display code from the OMB Ethnicity table
 */
function getEthnicityDisplay(code) {
  return ethnicityCodeToDisplay[code];
}


// Based on the OMB Race table found here: http://hl7.org/fhir/us/core/STU3.1/ValueSet-omb-race-category.html
const raceCodeToCodesystem = {
  '1002-5': 'urn:oid:2.16.840.1.113883.6.238',
  '2028-9': 'urn:oid:2.16.840.1.113883.6.238',
  '2054-5': 'urn:oid:2.16.840.1.113883.6.238',
  '2076-8': 'urn:oid:2.16.840.1.113883.6.238',
  '2106-3': 'urn:oid:2.16.840.1.113883.6.238',
  UNK: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
  ASKU: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
};

/**
 * Converts code in OMB Race to a codesystem value
 * @param {string} code, coded race value from the above table
 * @return {string} corresponding codesystem found in the OMB Race table f
 */
function getRaceCodesystem(code) {
  return raceCodeToCodesystem[code];
}


// Based on the OMB Race table found here: http://hl7.org/fhir/us/core/STU3.1/ValueSet-omb-race-category.html
const raceCodeToDisplay = {
  '1002-5': 'American Indian or Alaska Native',
  '2028-9': 'Asian',
  '2054-5': 'Black or African American',
  '2076-8': 'Native Hawaiian or Other Pacific Islander',
  '2106-3': 'White',
  UNK: 'Unknown Description: A proper value is applicable, but not known',
  ASKU: 'Asked but no answer',
};

/**
 * Converts code in OMB Race to a display value
 * @param {string} code, coded race value from the above table
 * @return {string} corresponding code from mCODE's ConditionStatusTrendVS
 */
function getRaceDisplay(code) {
  return raceCodeToDisplay[code];
}


/**
 * Turn a FHIR name object into a single name string
 * @param {Object} name object of the following shape: [{
 *   given: Array[String],
 *   ƒamily: String,
 * }]
 * @return {string} concatenated string of name values
 */
function getPatientName(name) {
  return ('extension' in name[0]) ? 'masked' : `${name[0].given.join(' ')} ${name[0].family}`;
}

/**
 * Mask fields in a Patient resource with
 * dataAbsentReason extension with value 'masked'
 * @param {Object} bundle a FHIR bundle with a Patient resource
 * @param {Array} mask an array of fields to mask. Values can be:
 * 'genderAndSex','mrn','name','address','birthDate','language','ethnicity',
 * 'race', 'telecom', 'multipleBirth', 'photo', 'contact', 'generalPractitioner',
 * 'managingOrganization', and 'link'
 * @param {Boolean} maskAll indicates that all supported fields should be masked, defaults to false
 */
function maskPatientData(bundle, mask, maskAll = false) {
  // get Patient resource from bundle
  const patient = fhirpath.evaluate(
    bundle,
    'Bundle.entry.where(resource.resourceType=\'Patient\').resource.first()',
  )[0];

  const validFields = [
    'genderAndSex',
    'mrn',
    'name',
    'address',
    'birthDate',
    'language',
    'ethnicity',
    'race',
    'telecom',
    'multipleBirth',
    'photo',
    'contact',
    'generalPractitioner',
    'managingOrganization',
    'link',
  ];
  const masked = extensionArr(dataAbsentReasonExtension('masked'));

  const maskingFields = maskAll ? validFields : mask;

  maskingFields.forEach((field) => {
    if (!validFields.includes(field)) {
      throw Error(`'${field}' is not a field that can be masked. Patient will only be extracted if all mask fields are valid. Valid fields include: Valid fields include: ${validFields.join(', ')}`);
    }
    // must check if the field exists in the patient resource, so we don't add unnecessary dataAbsent extensions
    if (field === 'genderAndSex') {
      if ('gender' in patient) {
        delete patient.gender;
        // an underscore is added when a primitive type is being replaced by an object (extension)
        patient._gender = masked;
      } else if ('_gender' in patient) {
        delete patient._gender; // gender may have a dataAbsentReason on it for 'unknown' data, but we'll still want to mask it
        patient._gender = masked;
      }
      // fields that are extensions need to be differentiated by URL using fhirpath
      const birthsex = fhirpath.evaluate(
        patient,
        'Patient.extension.where(url=\'http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex\')',
      );
      // fhirpath.evaluate will return [] if there is no extension with the given URL
      // so checking if the result is an array with anything in it checks if the field exists to be masked
      if (birthsex.length > 0) {
        delete birthsex[0].valueCode;
        birthsex[0]._valueCode = masked;
      }
      const legalsex = fhirpath.evaluate(
        patient,
        'Patient.extension.where(url=\'http://open.epic.com/FHIR/StructureDefinition/extension/legal-sex\')',
      );
      if (legalsex.length > 0) {
        legalsex[0].valueCodeableConcept = masked;
      }
      const clinicaluse = fhirpath.evaluate(
        patient,
        'Patient.extension.where(url=\'http://open.epic.com/FHIR/StructureDefinition/extension/sex-for-clinical-use\')',
      );
      if (clinicaluse.length > 0) {
        clinicaluse[0].valueCodeableConcept = masked;
      }
    } else if (field === 'mrn' && 'identifier' in patient) {
      // id and fullURL still need valid values, so we use a hashed version of MRN instead of dataAbsentReason
      const hash = crypto.createHash('sha256');
      const maskedMRN = hash.update(patient.id).digest('hex');

      patient.id = maskedMRN;
      const patientEntry = fhirpath.evaluate(
        bundle,
        'Bundle.entry.where(resource.resourceType=\'Patient\')',
      )[0];
      patientEntry.fullUrl = `urn:uuid:${maskedMRN}`;
      patient.identifier = [masked];
    } else if (field === 'name' && 'name' in patient) {
      patient.name = [masked];
    } else if (field === 'address' && 'address' in patient) {
      patient.address = [masked];
    } else if (field === 'birthDate' && 'birthDate' in patient) {
      delete patient.birthDate;
      patient._birthDate = masked;
    } else if (field === 'language') {
      if ('communication' in patient && 'language' in patient.communication[0]) {
        patient.communication[0].language = masked;
      }
    } else if (field === 'race') {
      const race = fhirpath.evaluate(
        patient,
        'Patient.extension.where(url=\'http://hl7.org/fhir/us/core/StructureDefinition/us-core-race\')',
      );
      if (race.length > 0) {
        race[0].extension[0].valueCoding = masked;
        delete race[0].extension[1].valueString;
        race[0].extension[1]._valueString = masked;
      }
    } else if (field === 'ethnicity') {
      const ethnicity = fhirpath.evaluate(
        patient,
        'Patient.extension.where(url=\'http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity\')',
      );
      if (ethnicity.length > 0) {
        ethnicity[0].extension[0].valueCoding = masked;
        delete ethnicity[0].extension[1].valueString;
        ethnicity[0].extension[1]._valueString = masked;
      }
    } else if (field === 'telecom' && 'telecom' in patient) {
      delete patient.telecom;
      patient.telecom = [masked];
    } else if (field === 'multipleBirth') {
      if ('multipleBirthBoolean' in patient) {
        delete patient.multipleBirthBoolean;
        patient._multipleBirthBoolean = masked;
      } else if ('multipleBirthInteger' in patient) {
        delete patient.multipleBirthInteger;
        patient._multipleBirthInteger = masked;
      }
    } else if (field === 'photo' && 'photo' in patient) {
      delete patient.photo;
      patient.photo = [masked];
    } else if (field === 'contact' && 'contact' in patient) {
      delete patient.contact;
      patient.contact = [masked];
    } else if (field === 'generalPractitioner' && 'generalPractitioner' in patient) {
      delete patient.generalPractitioner;
      patient.generalPractitioner = [masked];
    } else if (field === 'managingOrganization' && 'managingOrganization' in patient) {
      delete patient.managingOrganization;
      patient.managingOrganization = masked;
    } else if (field === 'link' && 'link' in patient) {
      delete patient.link;
      patient.link = [masked];
    }
  });
}

module.exports = {
  getEthnicityDisplay,
  getRaceCodesystem,
  getRaceDisplay,
  getPatientName,
  maskPatientData,
};
