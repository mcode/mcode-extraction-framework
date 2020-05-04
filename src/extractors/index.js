const { BaseFHIRExtractor } = require('./BaseFHIRExtractor');
const { CSVCancerDiseaseStatusExtractor } = require('./CSVCancerDiseaseStatusExtractor');
const { CSVClinicalTrialInformationExtractor } = require('./CSVClinicalTrialInformationExtractor');
const { CSVTreatmentPlanChangeExtractor } = require('./CSVTreatmentPlanChangeExtractor');
const { Extractor } = require('./Extractor');

module.exports = {
  BaseFHIRExtractor,
  CSVCancerDiseaseStatusExtractor,
  CSVClinicalTrialInformationExtractor,
  CSVTreatmentPlanChangeExtractor,
  Extractor,
};
