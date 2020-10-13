const ejs = require('ejs');
const _ = require('lodash');
const shajs = require('sha.js');
const logger = require('./logger');

const {
  cancerDiseaseStatusTemplate, carePlanWithReviewTemplate, conditionTemplate, observationTemplate, patientTemplate, researchStudyTemplate, researchSubjectTemplate,
} = require('../templates');

// TODO: When all templates have been updated, we can remove this entire array and always use the template functions
// TODO: As you update templates, add their lookup string to this list
const NEW_TEMPLATES = [
  'CancerDiseaseStatus',
  'CarePlanWithReview',
  'Condition',
  'Observation',
  'Patient',
  'ResearchStudy',
  'ResearchSubject',
];

// TODO: As you update templates, add their new templateFunction to this lookup table
const fhirTemplateLookup = {
  CancerDiseaseStatus: cancerDiseaseStatusTemplate,
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

// TODO:  REMOVE WHEN ALL TEMPLATES ARE FULLY UPDATED
function renderTemplate(template, data) {
  // Ensure that spread operator on data is last, so any data.id takes precedence
  const render = ejs.render(template, dataWithId(data));
  return JSON.parse(render);
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

  // TODO: REMOVE THIS CONDITIONAL WHEN ALL TEMPLATES ARE UPDATED
  if (NEW_TEMPLATES.includes(mcodeProfileID)) {
    const template = loadFhirTemplate(mcodeProfileID);
    if (!template) throw new Error(`No matching profile for ${mcodeProfileID} found`);
    return fillAndBundleTemplate(template, data);
  }

  // TODO: REMOVE OLD TEMPLATE RENDERING LOGIC WHEN ALL TEMPLATES ARE UPDATED
  const ejsTemplate = loadFhirTemplate(mcodeProfileID);
  if (!ejsTemplate) throw new Error(`No matching profile for ${mcodeProfileID} found`);
  return {
    resourceType: 'Bundle',
    type: 'collection',
    entry: (_.isArray(data) ? data : [data]).map((d) => ({
      fullUrl: `urn:uuid:${d.id || generateResourceId(d)}`,
      resource: renderTemplate(ejsTemplate, d),
    })),
  };
}

module.exports = {
  generateMcodeResources,
  renderTemplate,
};
