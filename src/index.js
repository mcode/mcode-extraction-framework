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
  CSVAdverseEventExtractor,
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
  FHIRAdverseEventExtractor,
  FHIRAllergyIntoleranceExtractor,
  FHIRConditionExtractor,
  FHIRDocumentReferenceExtractor,
  FHIREncounterExtractor,
  FHIRMedicationOrderExtractor,
  FHIRMedicationRequestExtractor,
  FHIRMedicationStatementExtractor,
  FHIRObservationExtractor,
  FHIRPatientExtractor,
  FHIRProcedureExtractor,
  MCODERadiationProcedureExtractor,
  MCODESurgicalProcedureExtractor,
} = require('./extractors');
const { BaseFHIRModule, CSVModule } = require('./modules');
const { getEthnicityDisplay,
  getPatientName,
  getRaceCodesystem,
  getRaceDisplay } = require('./helpers/patientUtils');
const {
  allResourcesInBundle,
  firstEntryInBundle,
  firstIdentifierEntry,
  firstResourceInBundle,
  getBundleEntriesByResourceType,
  getBundleResourcesByType,
  getEmptyBundle,
  getResourceCountInBundle,
  isBundleEmpty,
  logOperationOutcomeInfo,
} = require('./helpers/fhirUtils');
const { generateMcodeResources } = require('./templates');
const {
  getICD10Code,
  isConditionCodePrimary,
  isConditionCodeSecondary,
  isConditionPrimary,
  isConditionSecondary,
  isConditionCodeCancer,
  isConditionCancer,
} = require('./helpers/conditionUtils');
const { getDiseaseStatusCode, getDiseaseStatusEvidenceCode, mEpochToDate } = require('./helpers/diseaseStatusUtils');
const { formatDate, formatDateTime } = require('./helpers/dateUtils');
const { getConditionEntriesFromContext, getEncountersFromContext, getPatientFromContext } = require('./helpers/contextUtils');

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
  CSVAdverseEventExtractor,
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
  FHIRAdverseEventExtractor,
  FHIRAllergyIntoleranceExtractor,
  FHIRConditionExtractor,
  FHIRDocumentReferenceExtractor,
  FHIREncounterExtractor,
  FHIRMedicationOrderExtractor,
  FHIRMedicationRequestExtractor,
  FHIRMedicationStatementExtractor,
  FHIRObservationExtractor,
  FHIRPatientExtractor,
  FHIRProcedureExtractor,
  MCODERadiationProcedureExtractor,
  MCODESurgicalProcedureExtractor,
  logger,
  MCODEClient,
  // FHIR and resource helpers
  allResourcesInBundle,
  firstEntryInBundle,
  firstIdentifierEntry,
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
  getResourceCountInBundle,
  isBundleEmpty,
  isConditionCodePrimary,
  isConditionCodeSecondary,
  isConditionPrimary,
  isConditionSecondary,
  isConditionCodeCancer,
  isConditionCancer,
  logOperationOutcomeInfo,
  mEpochToDate,
  // Context operations
  getConditionEntriesFromContext,
  getEncountersFromContext,
  getPatientFromContext,
};
