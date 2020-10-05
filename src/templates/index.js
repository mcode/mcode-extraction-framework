const { patientTemplate } = require('./PatientTemplate');
const { cancerDiseaseStatusTemplate } = require('./CancerDiseaseStatusTemplate');
const { carePlanWithReviewTemplate } = require('./CarePlanWithReview');

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
