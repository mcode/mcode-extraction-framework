const { patientTemplate } = require('./PatientTemplate');
const { cancerDiseaseStatusTemplate } = require('./CancerDiseaseStatusTemplate');
const { carePlanWithReviewTemplate } = require('./CarePlanWithReviewTemplate');
const { researchStudyTemplate } = require('./ResearchStudyTemplate');
const { researchSubjectTemplate } = require('./ResearchSubjectTemplate');
const { conditionTemplate } = require('./ConditionTemplate');

module.exports = {
  cancerDiseaseStatusTemplate,
  carePlanWithReviewTemplate,
  conditionTemplate,
  patientTemplate,
  researchStudyTemplate,
  researchSubjectTemplate,
};
