const _ = require('lodash');
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

/**
* Parses context for Condition entries, which themselves contain resources
* @param {Object} context - Context object consisting of a FHIR Bundle
* @return {Array} All the conditions entries found in context
*/
function getConditionEntriesFromContext(context) {
  logger.debug('Getting condition entries from context');
  const conditionEntriesInContext = getBundleEntriesByResourceType(context, 'Condition', {}, false);
  if (conditionEntriesInContext.length === 0) {
    throw Error('Could not find any conditions in context; ensure that a ConditionExtractor is used earlier in your extraction configuration');
  }
  logger.debug(`Condition entries found in context. Found ${conditionEntriesInContext.length} condition resources.`);
  return conditionEntriesInContext;
}

/**
* Parses context for Condition resources
* @param {Object} context - Context object consisting of a FHIR Bundle
* @return {Array} All the conditions resources found in context
*/
function getConditionsFromContext(context) {
  logger.debug('Getting condition resources from context');
  const conditionsResourcesInContext = getBundleResourcesByType(context, 'Condition', {}, false);
  if (_.isEmpty(conditionsResourcesInContext)) {
    throw Error('Could not find any conditions in context; ensure that a ConditionExtractor is used earlier in your extraction configuration');
  }
  logger.debug(`Condition resources found in context. Found ${conditionsResourcesInContext.length} condition resources.`);
  return conditionsResourcesInContext;
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
