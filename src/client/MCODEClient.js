const { BaseClient } = require('./BaseClient');
const {
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
  FHIRAdverseEventExtractor,
  FHIRAllergyIntoleranceExtractor,
  FHIRConditionExtractor,
  FHIRDocumentReferenceExtractor,
  FHIRMedicationOrderExtractor,
  FHIRMedicationRequestExtractor,
  FHIRMedicationStatementExtractor,
  FHIRObservationExtractor,
  FHIRPatientExtractor,
  FHIRProcedureExtractor,
} = require('../extractors');

class MCODEClient extends BaseClient {
  constructor({ extractors, commonExtractorArgs, webServiceAuthConfig }) {
    super();
    this.registerExtractors(
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
      FHIRAdverseEventExtractor,
      FHIRAllergyIntoleranceExtractor,
      FHIRConditionExtractor,
      FHIRDocumentReferenceExtractor,
      FHIRMedicationOrderExtractor,
      FHIRMedicationRequestExtractor,
      FHIRMedicationStatementExtractor,
      FHIRObservationExtractor,
      FHIRPatientExtractor,
      FHIRProcedureExtractor,
    );
    // Store the extractors defined by the configuration file as local state
    this.extractorConfig = extractors;
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
