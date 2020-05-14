const logger = require('./helpers/logger');
const {
  BaseFHIRExtractor,
  CSVCancerDiseaseStatusExtractor,
  CSVClinicalTrialInformationExtractor,
  CSVPatientExtractor,
  CSVTreatmentPlanChangeExtractor,
  Extractor,
  ServiceClinicalTrialInformationExtractor,
} = require('./extractors');
const { BaseFHIRModule } = require('./modules');
const { getPatientName } = require('./helpers/patientUtils');
const { isBundleEmpty, firstResourceInBundle, allResourcesInBundle } = require('./helpers/fhirUtils');
const { generateMcodeResources } = require('./helpers/ejsUtils');
const { isConditionPrimary, isConditionSecondary, getICD10Code } = require('./helpers/conditionUtils');
const { getDiseaseStatusCode } = require('./helpers/diseaseStatusUtils');

module.exports = {
  BaseFHIRExtractor,
  BaseFHIRModule,
  CSVCancerDiseaseStatusExtractor,
  CSVClinicalTrialInformationExtractor,
  CSVPatientExtractor,
  CSVTreatmentPlanChangeExtractor,
  Extractor,
  ServiceClinicalTrialInformationExtractor,
  logger,
  allResourcesInBundle,
  firstResourceInBundle,
  getDiseaseStatusCode,
  generateMcodeResources,
  getICD10Code,
  getPatientName,
  isBundleEmpty,
  isConditionPrimary,
  isConditionSecondary,
};
