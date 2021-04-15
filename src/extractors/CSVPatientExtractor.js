const _ = require('lodash');
const { generateMcodeResources } = require('../templates');
const { BaseCSVExtractor } = require('./BaseCSVExtractor');
const { getEthnicityDisplay,
  getRaceCodesystem,
  getRaceDisplay,
  maskPatientData } = require('../helpers/patientUtils');
const { getEmptyBundle } = require('../helpers/fhirUtils');
const logger = require('../helpers/logger');
const { CSVPatientSchema } = require('../helpers/schemas/csv');

function joinAndReformatData(patientData) {
  logger.debug('Reformatting patient data from CSV into template format');
  // No join needed, just a reformatting
  const {
    mrn, familyName, givenName, gender, birthsex, dateOfBirth, race, ethnicity, language, addressLine, city, state, zip,
  } = patientData;

  if (!mrn) {
    throw Error('Missing required field for Patient CSV Extraction: mrn');
  }

  return {
    id: mrn,
    mrn,
    familyName,
    givenName,
    gender,
    birthsex,
    dateOfBirth,
    language,
    addressLine,
    city,
    state,
    zip,
    raceCode: race,
    raceCodesystem: getRaceCodesystem(race),
    raceText: getRaceDisplay(race),
    ethnicityCode: ethnicity,
    ethnicityText: getEthnicityDisplay(ethnicity),
  };
}

class CSVPatientExtractor extends BaseCSVExtractor {
  constructor({ filePath, mask = [] }) {
    super({ filePath, csvSchema: CSVPatientSchema });
    this.mask = mask;
  }

  async getPatientData(mrn) {
    logger.debug('Getting patient data');
    const data = await this.csvModule.get('mrn', mrn);
    // Should only be one patient with this mrn; get that pat from our arr
    return data[0];
  }

  async get({ mrn }) {
    // 1. Get all relevant data and do necessary post-processing
    const patientData = await this.getPatientData(mrn);
    if (_.isEmpty(patientData)) {
      logger.warn('No patient data found for this patient');
      return getEmptyBundle();
    }

    // 2. Format data for research study and research subject
    const packagedPatientData = joinAndReformatData(patientData);

    // 3. Generate FHIR Resources
    const bundle = generateMcodeResources('Patient', packagedPatientData);

    // mask fields in the patient data if specified in mask array
    if (this.mask.length > 0) maskPatientData(bundle, this.mask);
    return bundle;
  }
}

module.exports = {
  CSVPatientExtractor,
};
