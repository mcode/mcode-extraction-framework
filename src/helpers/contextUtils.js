const _ = require('lodash');
const logger = require('./logger');
const { getBundleEntriesByResourceType, getBundleResourcesByType } = require('./fhirUtils');


function getConditionsFromContext(mrn, context) {
  logger.debug('Getting conditions from context');
  const conditionsInContext = getBundleResourcesByType(context, 'Condition', {}, false);
  if (_.isEmpty(conditionsInContext)) {
    throw Error('Could not find conditions in context; ensure that a ConditionExtractor is used earlier in your extraction configuration');
  }
  logger.debug('Condition resources found in context.');
  return conditionsInContext;
}

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

/**
* Parses context for Encounter resources
* @param {Object} context - Context object consisting of a FHIR Bundle
* @return {Array} All the encounter resources found in context
*/
function getEncountersFromContext(context) {
  logger.debug('Getting encounter resources from context');
  const encountersInContext = getBundleResourcesByType(context, 'Encounter');
  if (encountersInContext.length === 0) {
    throw Error('Could not find any encounter resources in context; ensure that an EncounterExtractor is used earlier in your extraction configuration');
  }
  logger.debug(`Condition resources found in context. Found ${encountersInContext.length} condition resources.`);
  return encountersInContext;
}

module.exports = {
  getConditionEntriesFromContext,
  getConditionsFromContext,
  getEncountersFromContext,
  getPatientFromContext,
};
