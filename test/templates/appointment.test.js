const { isValidFHIR } = require('../../src/helpers/fhirUtils');
const maximalAppointment = require('./fixtures/maximal-appointment-resource.json');
const minimalAppointment = require('./fixtures/minimal-appointment-resource.json');
const { appointmentTemplate } = require('../../src/templates/AppointmentTemplate');

describe('test Appointment template', () => {
  test('valid data passed into template should generate valid FHIR resource', () => {
    const MAX_DATA = {
      id: 'appointmentId-1',
      patientParticipant: {
        id: '123',
      },
      status: 'arrived',
      serviceCategory: '35',
      serviceType: '175',
      appointmentType: 'CHECKUP',
      specialty: '394592004',
      start: '2019-12-10T09:00:00+00:00',
      end: '2019-12-10T11:00:00+00:00',
      cancelationCode: 'pat-cpp',
      description: 'Example description 1',
    };

    const generatedAppointment = appointmentTemplate(MAX_DATA);

    // Relevant fields should match the valid FHIR
    expect(generatedAppointment).toEqual(maximalAppointment);
    expect(isValidFHIR(generatedAppointment)).toBeTruthy();
  });

  test('valid data with only required attributes passed into template should generate valid FHIR resource', () => {
    const MINIMAL_DATA = {
      id: 'appointmentId-3',
      patientParticipant: {
        id: '789',
      },
      status: 'cancelled',
    };

    const generatedAppointment = appointmentTemplate(MINIMAL_DATA);

    // Relevant fields should match the valid FHIR
    expect(generatedAppointment).toEqual(minimalAppointment);
    expect(isValidFHIR(generatedAppointment)).toBeTruthy();
  });

  test('missing required data should throw an error', () => {
    const INVALID_DATA = {
      id: 'appointmentId-1',
      patientParticipant: {
        id: '123',
      },
      serviceCategory: '35',
      serviceType: '175',
      appointmentType: 'CHECKUP',
      specialty: '394592004',
      start: '2019-12-10T09:00:00+00:00',
      end: '2019-12-10T11:00:00+00:00',
      cancelationCode: 'pat-cpp',
      description: 'Example description 1',
    };

    expect(() => appointmentTemplate(INVALID_DATA)).toThrow(Error);
  });
});
