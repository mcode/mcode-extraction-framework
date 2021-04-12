const CSVCancerDiseaseStatusSchema = {
  headers: [
    { name: 'mrn', required: true },
    { name: 'conditionId', required: true },
    { name: 'diseaseStatusCode', required: true },
    { name: 'diseaseStatusText' },
    { name: 'dateOfObservation', required: true },
    { name: 'evidence' },
    { name: 'observationStatus' },
    { name: 'dateRecorded' },
  ],
};

const CSVConditionSchema = {
  headers: [
    { name: 'mrn', required: true },
    { name: 'conditionId', required: true },
    { name: 'codeSystem', required: true },
    { name: 'code', required: true },
    { name: 'displayName' },
    { name: 'category', required: true },
    { name: 'dateOfDiagnosis' },
    { name: 'clinicalStatus' },
    { name: 'verificationStatus' },
    { name: 'bodySite' },
    { name: 'laterality' },
    { name: 'histology' },
  ],
};

const CSVPatientSchema = {
  headers: [
    { name: 'mrn', required: true },
    { name: 'familyName' },
    { name: 'givenName' },
    { name: 'gender' },
    { name: 'birthsex' },
    { name: 'dateOfBirth' },
    { name: 'race' },
    { name: 'ethnicity' },
    { name: 'language' },
    { name: 'addressLine' },
    { name: 'city' },
    { name: 'state' },
    { name: 'zip' },
  ],
};

const CSVClinicalTrialInformationSchema = {
  headers: [
    { name: 'mrn', required: true },
    { name: 'trialSubjectID', required: true },
    { name: 'enrollmentStatus', required: true },
    { name: 'trialResearchID', required: true },
    { name: 'trialStatus', required: true },
    { name: 'trialResearchSystem' },
  ],
};

const CSVTreatmentPlanChangeSchema = {
  headers: [
    { name: 'mrn', required: true },
    { name: 'reasonCode' },
    { name: 'reasonDisplayText' },
    { name: 'changed', required: true },
    { name: 'dateOfCarePlan', required: true },
    { name: 'dateRecorded' },
  ],
};

module.exports = { CSVCancerDiseaseStatusSchema, CSVConditionSchema, CSVPatientSchema, CSVClinicalTrialInformationSchema, CSVTreatmentPlanChangeSchema };
