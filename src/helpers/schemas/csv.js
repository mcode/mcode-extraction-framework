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

const CSVStagingSchema = {
  headers: [
    { name: 'mrn', required: true },
    { name: 'conditionId', required: true },
    { name: 'stageGroup', required: true },
    { name: 't' },
    { name: 'n' },
    { name: 'm' },
    { name: 'type', required: true },
    { name: 'stagingSystem' },
    { name: 'stagingCodeSystem' },
    { name: 'effectiveDate', required: true },
  ],
};

const CSVCancerRelatedMedicationAdministrationSchema = {
  headers: [
    { name: 'mrn', required: true },
    { name: 'medicationId' },
    { name: 'code', required: true },
    { name: 'codeSystem', required: true },
    { name: 'displayText' },
    { name: 'startDate' },
    { name: 'endDate' },
    { name: 'treatmentReasonCode' },
    { name: 'treatmentReasonCodeSystem' },
    { name: 'treatmentReasonDisplayText' },
    { name: 'treatmentIntent' },
    { name: 'status', required: true },
  ],
};

const CSVCancerRelatedMedicationRequestSchema = {
  headers: [
    { name: 'mrn', required: true },
    { name: 'requestId' },
    { name: 'code', required: true },
    { name: 'codeSystem', required: true },
    { name: 'displayText' },
    { name: 'treatmentReasonCode' },
    { name: 'treatmentReasonCodeSystem' },
    { name: 'treatmentReasonDisplayText' },
    { name: 'procedureIntent' },
    { name: 'status', required: true },
    { name: 'intent', required: true },
    { name: 'authoredOn' },
    { name: 'requesterId', required: true },
  ],
};

const CSVProcedureSchema = {
  headers: [
    { name: 'mrn', required: true },
    { name: 'procedureId', required: true },
    { name: 'conditionId' },
    { name: 'status', required: true },
    { name: 'code', required: true },
    { name: 'codeSystem', required: true },
    { name: 'displayName' },
    { name: 'reasonCode' },
    { name: 'reasonCodeSystem' },
    { name: 'reasonDisplayName' },
    { name: 'effectiveDate', required: true },
    { name: 'bodySite' },
    { name: 'laterality' },
    { name: 'treatmentIntent' },
  ],
};

const CSVObservationSchema = {
  headers: [
    { name: 'mrn', required: true },
    { name: 'observationId', required: true },
    { name: 'status', required: true },
    { name: 'code', required: true },
    { name: 'codeSystem', required: true },
    { name: 'displayName' },
    { name: 'value', required: true },
    { name: 'valueCodeSystem' },
    { name: 'effectiveDate', required: true },
    { name: 'bodySite' },
    { name: 'laterality' },
  ],
};

const CSVAdverseEventSchema = {
  headers: [
    { name: 'mrn', required: true },
    { name: 'adverseEventId' },
    { name: 'adverseEventCode', required: true },
    { name: 'adverseEventCodeSystem' },
    { name: 'adverseEventDisplayText' },
    { name: 'suspectedCauseId' },
    { name: 'suspectedCauseType' },
    { name: 'seriousness' },
    { name: 'seriousnessCodeSystem' },
    { name: 'seriousnessDisplayText' },
    { name: 'category' },
    { name: 'categoryCodeSystem' },
    { name: 'categoryDisplayText' },
    { name: 'severity' },
    { name: 'actuality' },
    { name: 'studyId' },
    { name: 'effectiveDate', required: true },
    { name: 'recordedDate' },
  ],
};

const CSVCTCAdverseEventSchema = {
  headers: [
    { name: 'mrn', required: true },
    { name: 'adverseEventId' },
    { name: 'adverseEventCode', required: true },
    { name: 'adverseEventCodeSystem', required: true },
    { name: 'adverseEventCodeVersion' },
    { name: 'adverseEventDisplayText' },
    { name: 'adverseEventText' },
    { name: 'suspectedCauseId' },
    { name: 'suspectedCauseType' },
    { name: 'seriousness' },
    { name: 'seriousnessCodeSystem' },
    { name: 'seriousnessDisplayText' },
    { name: 'category' },
    { name: 'categoryCodeSystem' },
    { name: 'categoryDisplayText' },
    { name: 'studyId' },
    { name: 'effectiveDate', required: true },
    { name: 'recordedDate' },
    { name: 'grade', required: true },
    { name: 'expectation' },
    { name: 'resolvedDate' },
    { name: 'seriousnessOutcome' },
    { name: 'actor' },
    { name: 'functionCode' },
  ],
};

const CSVEncounterSchema = {
  headers: [
    { name: 'mrn', required: true },
    { name: 'encounterId', required: true },
    { name: 'status', required: true },
    { name: 'classCode', required: true },
    { name: 'classSystem', required: true },
    { name: 'typeCode' },
    { name: 'typeSystem' },
    { name: 'startDate' },
    { name: 'endDate' },
  ],
};

module.exports = {
  CSVCancerDiseaseStatusSchema,
  CSVConditionSchema,
  CSVPatientSchema,
  CSVClinicalTrialInformationSchema,
  CSVTreatmentPlanChangeSchema,
  CSVStagingSchema,
  CSVCancerRelatedMedicationAdministrationSchema,
  CSVCancerRelatedMedicationRequestSchema,
  CSVProcedureSchema,
  CSVObservationSchema,
  CSVAdverseEventSchema,
  CSVCTCAdverseEventSchema,
  CSVEncounterSchema,
};
