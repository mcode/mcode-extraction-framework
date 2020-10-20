const _ = require('lodash');
const shajs = require('sha.js');
const logger = require('../helpers/logger');

const { cancerDiseaseStatusTemplate } = require('./CancerDiseaseStatusTemplate');
const { cancerRelatedMedicationTemplate } = require('./CancerRelatedMedicationTemplate');
const { carePlanWithReviewTemplate } = require('./CarePlanWithReviewTemplate');
const { conditionTemplate } = require('./ConditionTemplate');
const { observationTemplate } = require('./ObservationTemplate');
const { patientTemplate } = require('./PatientTemplate');
const { researchStudyTemplate } = require('./ResearchStudyTemplate');
const { researchSubjectTemplate } = require('./ResearchSubjectTemplate');

const fhirTemplateLookup = {
  CancerDiseaseStatus: cancerDiseaseStatusTemplate,
  CancerRelatedMedication: cancerRelatedMedicationTemplate,
  CarePlanWithReview: carePlanWithReviewTemplate,
  Condition: conditionTemplate,
  Observation: observationTemplate,
  Patient: patientTemplate,
  ResearchStudy: researchStudyTemplate,
  ResearchSubject: researchSubjectTemplate,
};

function loadFhirTemplate(mcodeProfileID) {
  return fhirTemplateLookup[mcodeProfileID];
}

// Hash a data object to get a unique, deterministic ID for it
function generateResourceId(data) {
  return shajs('sha256').update(JSON.stringify(data)).digest('hex');
}

// Augment a data object with an ID if it doesn't have one
function dataWithId(data) {
  return { id: generateResourceId(data), ...data };
}

// Bundle the provided data, templating that data when appropriate with the supplied template function
function fillAndBundleTemplate(template, data) {
  return {
    resourceType: 'Bundle',
    type: 'collection',
    entry: (_.isArray(data) ? data : [data]).map((d) => ({
      fullUrl: `urn:uuid:${d.id || generateResourceId(d)}`,
      resource: template(dataWithId(d)),
    })),
  };
}

function generateMcodeResources(mcodeProfileID, data) {
  logger.debug(`Generating FHIR resource for ${mcodeProfileID} data element`);

  const template = loadFhirTemplate(mcodeProfileID);
  if (!template) throw new Error(`No matching profile for ${mcodeProfileID} found`);
  return fillAndBundleTemplate(template, data);
}

module.exports = {
  generateMcodeResources,
};