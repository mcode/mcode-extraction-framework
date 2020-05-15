const logger = require('./helpers/logger');
const {
  BaseFHIRExtractor,
  CSVCancerDiseaseStatusExtractor,
  CSVClinicalTrialInformationExtractor,
  CSVPatientExtractor,
  CSVTreatmentPlanChangeExtractor,
  Extractor,
} = require('./extractors');
const { BaseFHIRModule, CSVModule } = require('./modules');
const { getPatientName } = require('./helpers/patientUtils');
const { allResourcesInBundle, firstEntryInBundle, firstResourceInBundle, isBundleEmpty } = require('./helpers/fhirUtils');
const { generateMcodeResources } = require('./helpers/ejsUtils');
const { isConditionPrimary, isConditionSecondary, getICD10Code } = require('./helpers/conditionUtils');
const { getDiseaseStatusCode } = require('./helpers/diseaseStatusUtils');

module.exports = {
  BaseFHIRExtractor,
  CSVModule,
  BaseFHIRModule,
  CSVCancerDiseaseStatusExtractor,
  CSVClinicalTrialInformationExtractor,
  CSVPatientExtractor,
  CSVTreatmentPlanChangeExtractor,
  Extractor,
  logger,
  allResourcesInBundle,
  firstEntryInBundle,
  firstResourceInBundle,
  getDiseaseStatusCode,
  generateMcodeResources,
  getICD10Code,
  getPatientName,
  isBundleEmpty,
  isConditionPrimary,
  isConditionSecondary,
};
