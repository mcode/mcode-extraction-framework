const { patientTemplate } = require('./PatientTemplate');
const { cancerDiseaseStatusTemplate } = require('./CancerDiseaseStatusTemplate');
const { carePlanWithReviewTemplate } = require('./CarePlanWithReviewTemplate');

const conditionTemplate = () => { };
const researchStudyTemplate = () => { };
const researchSubjectTemplate = () => { };

module.exports = {
  cancerDiseaseStatusTemplate,
  carePlanWithReviewTemplate,
  conditionTemplate,
  patientTemplate,
  researchStudyTemplate,
  researchSubjectTemplate,
};
