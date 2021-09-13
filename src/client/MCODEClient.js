const { BaseClient } = require('./BaseClient');
const {
  CSVAdverseEventExtractor,
  CSVCancerDiseaseStatusExtractor,
  CSVCancerRelatedMedicationAdministrationExtractor,
  CSVCancerRelatedMedicationRequestExtractor,
  CSVClinicalTrialInformationExtractor,
  CSVConditionExtractor,
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
} = require('../extractors');
const { sortExtractors } = require('../helpers/dependencyUtils.js');

class MCODEClient extends BaseClient {
  constructor({ extractors, commonExtractorArgs, webServiceAuthConfig }) {
    super();
    this.registerExtractors(
      CSVAdverseEventExtractor,
      CSVCancerDiseaseStatusExtractor,
      CSVCancerRelatedMedicationAdministrationExtractor,
      CSVCancerRelatedMedicationRequestExtractor,
      CSVClinicalTrialInformationExtractor,
      CSVConditionExtractor,
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
    );
    // Store the extractors defined by the configuration file as local state
    this.extractorConfig = extractors;
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
    ];
    // Sort extractors based on order and dependencies
    this.extractorConfig = sortExtractors(this.extractorConfig, dependencyInfo);
    // Store webServiceAuthConfig if provided`
    this.authConfig = webServiceAuthConfig;
    this.commonExtractorArgs = {
      implementation: 'mcode',
      ...commonExtractorArgs,
    };
  }
}
module.exports = {
  MCODEClient,
};
