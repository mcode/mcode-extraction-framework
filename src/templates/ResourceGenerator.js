const _ = require('lodash');
const shajs = require('sha.js');
const logger = require('../helpers/logger');

const { adverseEventTemplate } = require('./AdverseEventTemplate');
const { cancerDiseaseStatusTemplate } = require('./CancerDiseaseStatusTemplate');
const { cancerRelatedMedicationTemplate } = require('./CancerRelatedMedicationTemplate');
const { carePlanWithReviewTemplate } = require('./CarePlanWithReviewTemplate');
const { conditionTemplate } = require('./ConditionTemplate');
const { observationTemplate } = require('./ObservationTemplate');
const { patientTemplate } = require('./PatientTemplate');
const { procedureTemplate } = require('./ProcedureTemplate');
const { researchStudyTemplate } = require('./ResearchStudyTemplate');
const { researchSubjectTemplate } = require('./ResearchSubjectTemplate');
const { stagingTemplate } = require('./StagingTemplate');
const { tnmCategoryTemplate } = require('./TNMCategoryTemplate');

const fhirTemplateLookup = {
  AdverseEvent: adverseEventTemplate,
  CancerDiseaseStatus: cancerDiseaseStatusTemplate,
  CancerRelatedMedication: cancerRelatedMedicationTemplate,
  CarePlanWithReview: carePlanWithReviewTemplate,
  Condition: conditionTemplate,
  Observation: observationTemplate,
  Patient: patientTemplate,
  Procedure: procedureTemplate,
  ResearchStudy: researchStudyTemplate,
  ResearchSubject: researchSubjectTemplate,
  Staging: stagingTemplate,
  TNMCategory: tnmCategoryTemplate,
};

function loadFhirTemplate(mcodeProfileID) {
  return fhirTemplateLookup[mcodeProfileID];
}

// Hash a data object to get a unique, deterministic ID for it
function generateResourceId(data) {
  return shajs('sha256').update(JSON.stringify(data)).digest('hex');
}

// Ensures that empty data in the resource object carries a null value, rather than being undefined or an empty string
function cleanEmptyData(data, depth = 0) {
  const cleanData = data;
  const MAX_DEPTH = 50;
  Object.keys(cleanData).forEach((key) => {
    if (typeof cleanData[key] === 'object' && cleanData[key]) {
      if (depth < MAX_DEPTH) cleanEmptyData(cleanData[key], depth + 1);
      else logger.warn('Maximum depth of 50 was reached while cleaning empty data on a resource, resource may not be cleaned entirely');
    }
    if (cleanData[key] === '' || cleanData[key] === undefined) {
      cleanData[key] = null;
    }
  });
  return cleanData;
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
  const cleanData = _.isArray(data) ? data.map((d) => cleanEmptyData(d)) : cleanEmptyData(data);
  if (!template) throw new Error(`No matching profile for ${mcodeProfileID} found`);
  return fillAndBundleTemplate(template, cleanData);
}

module.exports = {
  generateMcodeResources,
};
