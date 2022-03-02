const _ = require('lodash');
const logger = require('./logger');
const { getBundleEntriesByResourceType, getBundleResourcesByType } = require('./fhirUtils');

/**
* Parses context a Patient resource
* @param {Object} context - Context object consisting of a FHIR Bundle
* @return {Object} The first Patient resource found in the bundle
*/
function getPatientFromContext(context) {
  logger.debug('Getting patient from context');
  const patientResourceInContext = getBundleResourcesByType(context, 'Patient', {}, true);
  if (!patientResourceInContext) {
    throw Error('Could not find a patient in context; ensure that a PatientExtractor is used earlier in your extraction configuration');
  }
  logger.debug('Patient resource found in context.');
  return patientResourceInContext;
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
* Parses context for AdverseEvent resources
* @param {Object} context - Context object consisting of a FHIR Bundle
* @return {Array} All the AdverseEvent resources found in context
*/
function getAdverseEventsFromContext(context) {
  logger.debug('Getting adverse event resources from context');
  const adverseEventResourcesInContext = getBundleResourcesByType(context, 'AdverseEvent', {}, false);
  if (_.isEmpty(adverseEventResourcesInContext)) {
    throw Error('Could not find any adverse events in context; ensure that an AdverseEventExtractor is used earlier in your extraction configuration');
  }
  logger.debug(`AdverseEvent resources found in context. Found ${adverseEventResourcesInContext.length} adverse event resources.`);
  return adverseEventResourcesInContext;
}

/**
* Parses context for AdverseEvent entries, which themselves contain resources
* @param {Object} context - Context object consisting of a FHIR Bundle
* @return {Array} All the AdverseEvents entries found in context
*/
function getAdverseEventEntriesFromContext(context) {
  logger.debug('Getting adverse event entries from context');
  const adverseEventEntriesInContext = getBundleEntriesByResourceType(context, 'AdverseEvent', {}, false);
  if (adverseEventEntriesInContext.length === 0) {
    throw Error('Could not find any adverse events in context; ensure that an AdverseEventExtractor is used earlier in your extraction configuration');
  }
  logger.debug(`AdverseEvent entries found in context. Found ${adverseEventEntriesInContext.length} adverse event resources.`);
  return adverseEventEntriesInContext;
}

/**
* Parses context for Encounter resources
* @param {Object} context - Context object consisting of a FHIR Bundle
* @return {Array} All the encounter resources found in context
*/
function getEncountersFromContext(context) {
  logger.debug('Getting encounter resources from context');
  const encounterResourcesInContext = getBundleResourcesByType(context, 'Encounter');
  if (encounterResourcesInContext.length === 0) {
    throw Error('Could not find any encounter resources in context; ensure that an EncounterExtractor is used earlier in your extraction configuration');
  }
  logger.debug(`Condition resources found in context. Found ${encounterResourcesInContext.length} condition resources.`);
  return encounterResourcesInContext;
}

function getResearchStudiesFromContext(context) {
  logger.debug('Getting ResearchStudy resources from context');
  const researchStudyResourcesInContext = getBundleResourcesByType(context, 'ResearchStudy', {}, false);
  if (researchStudyResourcesInContext.length === 0) {
    throw Error('Could not find any ResearchStudy resources in context; ensure that a ClinicalTrialInformationExtractor or ResearchStudyExtractor is used earlier in your extraction configuration');
  }
  logger.debug(`ResearchStudy resources found in context. Found ${researchStudyResourcesInContext.length} ResearchStudy resources.`);
  return researchStudyResourcesInContext;
}

module.exports = {
  getConditionEntriesFromContext,
  getConditionsFromContext,
  getEncountersFromContext,
  getPatientFromContext,
  getResearchStudiesFromContext,
  getAdverseEventEntriesFromContext,
  getAdverseEventsFromContext,
};
