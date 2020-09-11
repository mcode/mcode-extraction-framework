const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const _ = require('lodash');
const shajs = require('sha.js');
const logger = require('./logger');


const fhirTemplateLookup = {
  CancerDiseaseStatus: fs.readFileSync(path.join(__dirname, '../templates/CancerDiseaseStatus.ejs'), 'utf8'),
  CarePlanWithReview: fs.readFileSync(path.join(__dirname, '../templates/CarePlanWithReview.ejs'), 'utf8'),
  Condition: fs.readFileSync(path.join(__dirname, '../templates/Condition.ejs'), 'utf8'),
  Patient: fs.readFileSync(path.join(__dirname, '../templates/Patient.ejs'), 'utf8'),
  ResearchStudy: fs.readFileSync(path.join(__dirname, '../templates/ResearchStudy.ejs'), 'utf8'),
  ResearchSubject: fs.readFileSync(path.join(__dirname, '../templates/ResearchSubject.ejs'), 'utf8'),
};

function loadFhirTemplate(mcodeProfileID) {
  return fhirTemplateLookup[mcodeProfileID];
}

function generateResourceId(data) {
  return shajs('sha256').update(JSON.stringify(data)).digest('hex');
}

function renderTemplate(template, data) {
  // Ensure that spread operator on data is last, so any data.id takes precedence
  const render = ejs.render(template, { id: generateResourceId(data), ...data });
  return JSON.parse(render);
}

function generateMcodeResources(mcodeProfileID, data) {
  logger.debug(`Generating FHIR resource for ${mcodeProfileID} data element`);
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
