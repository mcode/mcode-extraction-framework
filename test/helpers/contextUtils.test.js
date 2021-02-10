const { getConditionEntriesFromContext, getPatientFromContext } = require('../../src/helpers/contextUtils');

const MOCK_PATIENT_MRN = '123';

describe('getPatientFromContext', () => {
  const patientResource = {
    resourceType: 'Patient',
    id: 'mCODEPatientExample01',
  };
  const patientContext = {
    resourceType: 'Bundle',
    type: 'collection',
    entry: [
      {
        fullUrl: 'context-url-1',
        resource: patientResource,
      },
    ],
  };
  test('Should return Patient resource in context', () => {
    const patient = getPatientFromContext(MOCK_PATIENT_MRN, patientContext);
    expect(patient.id).toEqual(patientResource.id);
  });

  test('Should throw an error if there is no patient in context', () => {
    expect(() => getPatientFromContext(MOCK_PATIENT_MRN, {})).toThrow('Could not find a patient in context; ensure that a PatientExtractor is used earlier in your extraction configuration');
  });
});

describe('getConditionFromContext', () => {
  const conditionResource = {
    resourceType: 'Condition',
    id: 'mCODEConditionExample01',
  };
  const conditionContext = {
    resourceType: 'Bundle',
    type: 'collection',
    entry: [
      {
        fullUrl: 'context-url-1',
        resource: conditionResource,
      },
      {
        fullUrl: 'context-url-2',
        resource: { ...conditionResource, id: 'mCODEConditionExample02' },
      },
    ],
  };

  test('Should return all Condition resources in context', () => {
    const conditions = getConditionEntriesFromContext(MOCK_PATIENT_MRN, conditionContext);
    expect(conditions).toHaveLength(2);
    expect(conditions[0]).toEqual({
      fullUrl: 'context-url-1',
      resource: conditionResource,
    });
  });

  test('Should throw an error if there are no conditions in context', () => {
    expect(() => getConditionEntriesFromContext(MOCK_PATIENT_MRN, {}))
      .toThrow('Could not find any conditions in context; ensure that a ConditionExtractor is used earlier in your extraction configuration');
  });
});
