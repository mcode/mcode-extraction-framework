const logger = require('./logger');
const { getBundleResourcesByType } = require('./fhirUtils');

function getPatientFromContext(mrn, context) {
  logger.debug('Getting patient from context');
  const patientInContext = getBundleResourcesByType(context, 'Patient', {}, true);
  if (!patientInContext) {
    throw Error('Could not find a patient in context; ensure that a PatientExtractor is used earlier in your extraction configuration');
  }
  logger.debug('Patient resource found in context.');
  return patientInContext;
}

module.exports = {
  getPatientFromContext,
};
