const logger = require('./helpers/logger');
const {
  BaseFHIRExtractor,
  CSVClinicalTrialInformationExtractor,
  CSVCancerDiseaseStatusExtractor,
  CSVTreatmentPlanChangeExtractor,
  Extractor,
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
  CSVTreatmentPlanChangeExtractor,
  Extractor,
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
