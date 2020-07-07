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
  getEmptyBundle,
  isBundleEmpty,
} = require('./helpers/fhirUtils');
const { generateMcodeResources } = require('./helpers/ejsUtils');
const {
  isConditionCodePrimary,
  isConditionCodeSecondary,
  isConditionPrimary,
  isConditionSecondary,
  getICD10Code,
} = require('./helpers/conditionUtils');
const { getDiseaseStatusCode, getDiseaseStatusEvidenceCode } = require('./helpers/diseaseStatusUtils');
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
  getEmptyBundle,
  generateMcodeResources,
  getBundleResourcesByType,
  getDiseaseStatusCode,
  getDiseaseStatusEvidenceCode,
  getICD10Code,
  getPatientName,
  isBundleEmpty,
  isConditionCodePrimary,
  isConditionPrimary,
  isConditionCodeSecondary,
  isConditionSecondary,
};
