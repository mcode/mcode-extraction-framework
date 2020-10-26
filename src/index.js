const logger = require('./helpers/logger');
const { BaseClient } = require('./client/BaseClient');
const { MCODEClient } = require('./client/MCODEClient');
const {
  mcodeApp,
  RunInstanceLogger,
  extractDataForPatients,
  sendEmailNotification,
  zipErrors,
} = require('./cli');
const {
  BaseFHIRExtractor,
  CSVCancerDiseaseStatusExtractor,
  CSVCancerRelatedMedicationExtractor,
  CSVClinicalTrialInformationExtractor,
  CSVConditionExtractor,
  CSVObservationExtractor,
  CSVPatientExtractor,
  CSVProcedureExtractor,
  CSVStagingExtractor,
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
const { getEthnicityDisplay,
  getPatientName,
  getRaceCodesystem,
  getRaceDisplay } = require('./helpers/patientUtils');
const {
  allResourcesInBundle,
  firstEntryInBundle,
  firstResourceInBundle,
  getBundleEntriesByResourceType,
  getBundleResourcesByType,
  getEmptyBundle,
  isBundleEmpty,
  logOperationOutcomeInfo,
} = require('./helpers/fhirUtils');
const { generateMcodeResources } = require('./templates');
const {
  isConditionCodePrimary,
  isConditionCodeSecondary,
  isConditionPrimary,
  isConditionSecondary,
  isConditionCodeCancer,
  isConditionCancer,
  getICD10Code,
} = require('./helpers/conditionUtils');
const { getDiseaseStatusCode, getDiseaseStatusEvidenceCode, mEpochToDate } = require('./helpers/diseaseStatusUtils');
const { formatDate, formatDateTime } = require('./helpers/dateUtils');

module.exports = {
  // CLI Related utilities
  mcodeApp,
  RunInstanceLogger,
  extractDataForPatients,
  sendEmailNotification,
  zipErrors,
  // Extractors and Clients
  BaseClient,
  BaseFHIRExtractor,
  BaseFHIRModule,
  CSVCancerDiseaseStatusExtractor,
  CSVCancerRelatedMedicationExtractor,
  CSVClinicalTrialInformationExtractor,
  CSVConditionExtractor,
  CSVModule,
  CSVPatientExtractor,
  CSVObservationExtractor,
  CSVProcedureExtractor,
  CSVStagingExtractor,
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
  MCODEClient,
  // FHIR and resource helpers
  allResourcesInBundle,
  firstEntryInBundle,
  firstResourceInBundle,
  formatDate,
  formatDateTime,
  generateMcodeResources,
  getBundleEntriesByResourceType,
  getBundleResourcesByType,
  getDiseaseStatusCode,
  getDiseaseStatusEvidenceCode,
  getEmptyBundle,
  getEthnicityDisplay,
  getICD10Code,
  getPatientName,
  getRaceCodesystem,
  getRaceDisplay,
  isBundleEmpty,
  isConditionCodePrimary,
  isConditionCodeSecondary,
  isConditionPrimary,
  isConditionSecondary,
  isConditionCodeCancer,
  isConditionCancer,
  logOperationOutcomeInfo,
  mEpochToDate,
};
