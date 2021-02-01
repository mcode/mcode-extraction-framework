const { getPatientFromContext } = require('../../src/helpers/contextUtils');

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
