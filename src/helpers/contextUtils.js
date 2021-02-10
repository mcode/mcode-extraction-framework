const logger = require('./logger');
const { getBundleEntriesByResourceType, getBundleResourcesByType } = require('./fhirUtils');

function getPatientFromContext(mrn, context) {
  logger.debug('Getting patient from context');
  const patientInContext = getBundleResourcesByType(context, 'Patient', {}, true);
  if (!patientInContext) {
    throw Error('Could not find a patient in context; ensure that a PatientExtractor is used earlier in your extraction configuration');
  }
  logger.debug('Patient resource found in context.');
  return patientInContext;
}

function getConditionEntriesFromContext(mrn, context) {
  logger.debug('Getting conditions from context');
  const conditionsInContext = getBundleEntriesByResourceType(context, 'Condition', {}, false);
  if (conditionsInContext.length === 0) {
    throw Error('Could not find any conditions in context; ensure that a ConditionExtractor is used earlier in your extraction configuration');
  }
  logger.debug(`Condition resources found in context. Found ${conditionsInContext.length} condition resources.`);
  return conditionsInContext;
}

module.exports = {
  getConditionEntriesFromContext,
  getPatientFromContext,
};
