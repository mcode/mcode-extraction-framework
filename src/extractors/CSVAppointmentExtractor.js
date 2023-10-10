const { BaseCSVExtractor } = require('./BaseCSVExtractor');
const { generateMcodeResources } = require('../templates');
const { getPatientFromContext } = require('../helpers/contextUtils');
const { getEmptyBundle } = require('../helpers/fhirUtils');
const { formatDateTime } = require('../helpers/dateUtils');
const { CSVAppointmentSchema } = require('../helpers/schemas/csv');
const logger = require('../helpers/logger');

// Formats data to be passed into template-friendly format
function formatData(appointmentData, patientId) {
  logger.debug('Reformatting appointment data from CSV into template format');
  return appointmentData.map((data) => {
    const {
      appointmentid: appointmentId,
      status,
      servicecategory: serviceCategory,
      servicetype: serviceType,
      appointmenttype: appointmentType,
      specialty,
      start,
      end,
      cancelationcode: cancelationCode,
      description,
    } = data;

    if (!(appointmentId && status)) {
      throw Error('Missing required field for Appointment CSV Extraction: appointmentId or status');
    }

    return {
      ...(appointmentId && { id: appointmentId }),
      patientParticipant: {
        id: patientId,
      },
      status,
      serviceCategory,
      serviceType,
      appointmentType,
      specialty,
      start: !start ? null : formatDateTime(start),
      end: !end ? null : formatDateTime(end),
      cancelationCode,
      description,
    };
  });
}

class CSVAppointmentExtractor extends BaseCSVExtractor {
  constructor({
    filePath, url, fileName, dataDirectory, csvParse,
  }) {
    super({ filePath, url, fileName, dataDirectory, csvSchema: CSVAppointmentSchema, csvParse });
  }

  async getAppointmentData(mrn) {
    logger.debug('Getting Appointment Data');
    return this.csvModule.get('mrn', mrn);
  }

  async get({ mrn, context }) {
    const appointmentData = await this.getAppointmentData(mrn);
    if (appointmentData.length === 0) {
      logger.warn('No appointment data found for patient');
      return getEmptyBundle();
    }
    const patientId = getPatientFromContext(context).id;

    // Reformat data
    const formattedData = formatData(appointmentData, patientId);

    // Fill templates
    return generateMcodeResources('Appointment', formattedData);
  }
}

module.exports = {
  CSVAppointmentExtractor,
};
