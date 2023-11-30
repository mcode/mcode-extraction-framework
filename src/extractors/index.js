const { BaseCSVExtractor } = require('./BaseCSVExtractor');
const { BaseFHIRExtractor } = require('./BaseFHIRExtractor');
const { CSVAdverseEventExtractor } = require('./CSVAdverseEventExtractor');
const { CSVAppointmentExtractor } = require('./CSVAppointmentExtractor');
const { CSVCancerDiseaseStatusExtractor } = require('./CSVCancerDiseaseStatusExtractor');
const { CSVCancerRelatedMedicationAdministrationExtractor } = require('./CSVCancerRelatedMedicationAdministrationExtractor');
const { CSVCancerRelatedMedicationRequestExtractor } = require('./CSVCancerRelatedMedicationRequestExtractor');
const { CSVClinicalTrialInformationExtractor } = require('./CSVClinicalTrialInformationExtractor');
const { CSVConditionExtractor } = require('./CSVConditionExtractor');
const { CSVCTCAdverseEventExtractor } = require('./CSVCTCAdverseEventExtractor');
const { CSVEncounterExtractor } = require('./CSVEncounterExtractor');
const { CSVObservationExtractor } = require('./CSVObservationExtractor');
const { CSVPatientExtractor } = require('./CSVPatientExtractor');
const { CSVProcedureExtractor } = require('./CSVProcedureExtractor');
const { CSVStagingExtractor } = require('./CSVStagingExtractor');
const { CSVTreatmentPlanChangeExtractor } = require('./CSVTreatmentPlanChangeExtractor');
const { Extractor } = require('./Extractor');
const { FHIRAdverseEventExtractor } = require('./FHIRAdverseEventExtractor');
const { FHIRAllergyIntoleranceExtractor } = require('./FHIRAllergyIntoleranceExtractor');
const { FHIRConditionExtractor } = require('./FHIRConditionExtractor');
const { FHIRDocumentReferenceExtractor } = require('./FHIRDocumentReferenceExtractor');
const { FHIREncounterExtractor } = require('./FHIREncounterExtractor');
const { FHIRMedicationOrderExtractor } = require('./FHIRMedicationOrderExtractor');
const { FHIRMedicationRequestExtractor } = require('./FHIRMedicationRequestExtractor');
const { FHIRMedicationStatementExtractor } = require('./FHIRMedicationStatementExtractor');
const { FHIRObservationExtractor } = require('./FHIRObservationExtractor');
const { FHIRPatientExtractor } = require('./FHIRPatientExtractor');
const { FHIRProcedureExtractor } = require('./FHIRProcedureExtractor');
const { MCODESurgicalProcedureExtractor } = require('./MCODESurgicalProcedureExtractor');

// Define information about the order and dependencies of extractors
const dependencyInfo = [
  { type: 'CSVPatientExtractor', dependencies: [] },
  { type: 'CSVConditionExtractor', dependencies: ['CSVPatientExtractor'] },
  { type: 'CSVCancerDiseaseStatusExtractor', dependencies: ['CSVPatientExtractor'] },
  { type: 'CSVClinicalTrialInformationExtractor', dependencies: ['CSVPatientExtractor'] },
  { type: 'CSVTreatmentPlanChangeExtractor', dependencies: ['CSVPatientExtractor'] },
  { type: 'CSVStagingExtractor', dependencies: ['CSVPatientExtractor'] },
  { type: 'CSVCancerRelatedMedicationAdministrationExtractor', dependencies: ['CSVPatientExtractor'] },
  { type: 'CSVCancerRelatedMedicationRequestExtractor', dependencies: ['CSVPatientExtractor'] },
  { type: 'CSVProcedureExtractor', dependencies: ['CSVPatientExtractor'] },
  { type: 'CSVObservationExtractor', dependencies: ['CSVPatientExtractor'] },
  { type: 'CSVAdverseEventExtractor', dependencies: ['CSVPatientExtractor'] },
  { type: 'CSVCTCAdverseEventExtractor', dependencies: ['CSVPatientExtractor'] },
  { type: 'CSVEncounterExtractor', dependencies: ['CSVPatientExtractor'] },
  { type: 'CSVAppointmentExtractor', dependencies: ['CSVPatientExtractor'] },
];

const CSVExtractors = [
  CSVAdverseEventExtractor,
  CSVAppointmentExtractor,
  CSVCancerDiseaseStatusExtractor,
  CSVCancerRelatedMedicationAdministrationExtractor,
  CSVCancerRelatedMedicationRequestExtractor,
  CSVClinicalTrialInformationExtractor,
  CSVConditionExtractor,
  CSVCTCAdverseEventExtractor,
  CSVEncounterExtractor,
  CSVObservationExtractor,
  CSVPatientExtractor,
  CSVProcedureExtractor,
  CSVStagingExtractor,
  CSVTreatmentPlanChangeExtractor,
];

const allExtractors = [
  CSVAdverseEventExtractor,
  CSVAppointmentExtractor,
  CSVCancerDiseaseStatusExtractor,
  CSVCancerRelatedMedicationAdministrationExtractor,
  CSVCancerRelatedMedicationRequestExtractor,
  CSVClinicalTrialInformationExtractor,
  CSVConditionExtractor,
  CSVCTCAdverseEventExtractor,
  CSVEncounterExtractor,
  CSVObservationExtractor,
  CSVPatientExtractor,
  CSVProcedureExtractor,
  CSVStagingExtractor,
  CSVTreatmentPlanChangeExtractor,
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
];

module.exports = {
  allExtractors,
  CSVExtractors,
  dependencyInfo,
  BaseCSVExtractor,
  BaseFHIRExtractor,
  CSVAdverseEventExtractor,
  CSVAppointmentExtractor,
  CSVCancerDiseaseStatusExtractor,
  CSVCancerRelatedMedicationAdministrationExtractor,
  CSVCancerRelatedMedicationRequestExtractor,
  CSVClinicalTrialInformationExtractor,
  CSVConditionExtractor,
  CSVCTCAdverseEventExtractor,
  CSVEncounterExtractor,
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
  MCODESurgicalProcedureExtractor,
};
