const { ifAllArgsObj } = require('../helpers/templateUtils');
const { reference, coding } = require('./snippets');

function patientParticipantTemplate({ patientParticipant }) {
  return {
    participant: [
      {
        actor: reference({ ...patientParticipant, resourceType: 'Patient' }),
        status: 'tentative',
      },
    ],
  };
}

function cancelationReasonTemplate({ cancelationCode }) {
  return {
    cancelationReason: {
      coding: [coding({ code: cancelationCode, system: 'http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason' })],
    },
  };
}

function serviceCategoryTemplate({ serviceCategory }) {
  return {
    serviceCategory: [{
      coding: [coding({ code: serviceCategory, system: 'http://terminology.hl7.org/CodeSystem/service-category' })],
    }],
  };
}

function serviceTypeTemplate({ serviceType }) {
  return {
    serviceType: [{
      coding: [coding({ code: serviceType, system: 'http://terminology.hl7.org/CodeSystem/service-type' })],
    }],
  };
}


function appointmentTypeTemplate({ appointmentType }) {
  return {
    appointmentType: {
      coding: [coding({ code: appointmentType, system: 'http://terminology.hl7.org/CodeSystem/v2-0276' })],
    },
  };
}

function specialtyTemplate({ specialty }) {
  return {
    specialty: [{
      coding: [coding({ code: specialty, system: 'http://snomed.info/sct' })],
    }],
  };
}


function appointmentTemplate({
  id, patientParticipant, status, serviceCategory, serviceType, appointmentType, specialty, start, end, cancelationCode, description,
}) {
  if (!(id && status)) {
    throw Error('Trying to render an AppointmentTemplate, but a required argument is missing; ensure that id and status are all present');
  }

  return {
    resourceType: 'Appointment',
    id,
    status,
    ...ifAllArgsObj(serviceCategoryTemplate)({ serviceCategory }),
    ...ifAllArgsObj(serviceTypeTemplate)({ serviceType }),
    ...ifAllArgsObj(appointmentTypeTemplate)({ appointmentType }),
    ...ifAllArgsObj(specialtyTemplate)({ specialty }),
    ...patientParticipantTemplate({ patientParticipant }),
    ...(start && { start }),
    ...(end && { end }),
    ...ifAllArgsObj(cancelationReasonTemplate)({ cancelationCode }),
    ...(description && { description }),
  };
}

module.exports = {
  appointmentTemplate,
};
