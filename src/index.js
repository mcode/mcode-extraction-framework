const logger = require('./helpers/logger');
const { BaseClient } = require('./client/BaseClient');
const {
  BaseFHIRExtractor,
  CSVCancerDiseaseStatusExtractor,
  CSVClinicalTrialInformationExtractor,
  CSVConditionExtractor,
  CSVPatientExtractor,
  CSVProcedureExtractor,
  CSVTreatmentPlanChangeExtractor,
  CSVObservationExtractor,
  CSVCancerRelatedMedicationExtractor,
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
  BaseClient,
  BaseFHIRExtractor,
  BaseFHIRModule,
  CSVCancerDiseaseStatusExtractor,
  CSVClinicalTrialInformationExtractor,
  CSVConditionExtractor,
  CSVModule,
  CSVPatientExtractor,
  CSVProcedureExtractor,
  CSVTreatmentPlanChangeExtractor,
  CSVCancerRelatedMedicationExtractor,
  CSVObservationExtractor,
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
  mEpochToDate,
};
