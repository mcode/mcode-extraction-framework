const logger = require('./helpers/logger');
const {
  BaseFHIRExtractor,
  CSVCancerDiseaseStatusExtractor,
  CSVClinicalTrialInformationExtractor,
  CSVConditionExtractor,
  CSVPatientExtractor,
  CSVTreatmentPlanChangeExtractor,
  Extractor,
  FHIRAllergyIntoleranceExtractor,
  FHIRConditionExtractor,
  FHIRDocumentReferenceExtractor,
  FHIRMedicationOrderExtractor,
  FHIRMedicationRequestExtractor,
  FHIRMedicationStatementExtractor,
  FHIRObservationExtractor,
  FHIRPatientExtractor,
  FHIRProcedureExtractor,
} = require('./extractors');
const { BaseFHIRModule, CSVModule } = require('./modules');
const { getPatientName } = require('./helpers/patientUtils');
const {
  allResourcesInBundle,
  firstEntryInBundle,
  firstResourceInBundle,
  getBundleResourcesByType,
  isBundleEmpty,
} = require('./helpers/fhirUtils');
const { generateMcodeResources } = require('./helpers/ejsUtils');
const { isConditionPrimary, isConditionSecondary, getICD10Code } = require('./helpers/conditionUtils');
const { getDiseaseStatusCode } = require('./helpers/diseaseStatusUtils');
const { formatDate, formatDateTime } = require('./helpers/dateUtils');

module.exports = {
  BaseFHIRExtractor,
  BaseFHIRModule,
  CSVCancerDiseaseStatusExtractor,
  CSVClinicalTrialInformationExtractor,
  CSVConditionExtractor,
  CSVModule,
  CSVPatientExtractor,
  CSVTreatmentPlanChangeExtractor,
  Extractor,
  FHIRAllergyIntoleranceExtractor,
  FHIRConditionExtractor,
  FHIRDocumentReferenceExtractor,
  FHIRMedicationOrderExtractor,
  FHIRMedicationRequestExtractor,
  FHIRMedicationStatementExtractor,
  FHIRObservationExtractor,
  FHIRPatientExtractor,
  FHIRProcedureExtractor,
  logger,
  allResourcesInBundle,
  firstEntryInBundle,
  firstResourceInBundle,
  formatDate,
  formatDateTime,
  generateMcodeResources,
  getBundleResourcesByType,
  getDiseaseStatusCode,
  getICD10Code,
  getPatientName,
  isBundleEmpty,
  isConditionPrimary,
  isConditionSecondary,
};
