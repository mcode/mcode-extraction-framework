const nodemailer = require('nodemailer');
const logger = require('../../helpers/logger');

function zipErrors(...allErrorSources) {
  // NOTE: assumes each error object is a k-v pair: k is the MRN-id CSV row of the patient, v is an [errors] for that patient at some pipeline step
  const zippedErrors = {};

  allErrorSources.forEach((errorObject) => {
    const keys = Object.keys(errorObject);
    keys.forEach((key) => {
      if (zippedErrors[key] === undefined) {
        zippedErrors[key] = [];
      }
      zippedErrors[key] = zippedErrors[key].concat(errorObject[key]);
    });
  });
  return zippedErrors;
}

async function sendEmailNotification(notificationInfo, errors, debug = false) {
  // Given a notifcationInfo config, an aggregated errors object and an optional debug flag,
  // Trigger the submission of a nodemailer email according to configuration
  const totalErrors = Object.keys(errors).reduce((previousValue, currentValue) => previousValue + errors[currentValue].length, 0);
  if (totalErrors === 0) {
    return;
  }

  if (!notificationInfo.to || !notificationInfo.host) {
    const errorMessage = `Email notification information incomplete. Unable to send email with ${totalErrors} errors.`
      + 'Update notificationInfo object in configuration in order to receive emails when errors occur.';
    throw new Error(errorMessage);
  }

  // Aggregate errors and build email message
  let emailBody = '';
  const fromAddress = notificationInfo.from || 'mCODE Extraction Errors mcode-extraction-errors@mitre.org';
  if (fromAddress.includes('mcode-extraction-errors@mitre.org')) {
    emailBody += '[This is an automated email from the mCODE Extraction Client. Do not reply to this message.]\n\n';
  }

  emailBody += 'Thank you for using the mCODE Extraction Client. ';
  emailBody += 'Unfortunately, the following errors occurred when running the extraction client:\n\n';
  Object.keys(errors).forEach((patientRow) => {
    emailBody += `Errors for patient at row ${parseInt(patientRow, 10) + 1} in .csv file:\n\n`;
    errors[patientRow].forEach((e) => {
      emailBody += `${e.message.trim()}\n`;
      if (debug) emailBody += `${e.stack}\n\n`;
    });
    if (errors[patientRow].length === 0) {
      emailBody += 'No errors for this patient. Extraction was successful.\n';
    }
    emailBody += '\n============================================================\n\n';
  });

  if (!debug) {
    emailBody += 'For additional stack trace information about these errors, run the extraction client using the `--debug` flag. ';
    emailBody += 'The stack trace information can be seen in the terminal as well as in the notification email.';
  }

  // Ensure that the tlsRejectUnauthorized property is a boolean
  if (
    notificationInfo.tlsRejectUnauthorized
    && !(
      notificationInfo.tlsRejectUnauthorized === true
      || notificationInfo.tlsRejectUnauthorized === false
    )
  ) {
    logger.warn('The notificationInfo.tlsRejectUnauthorized should be a boolean value. The value provided will not be used.');
  }

  const transporter = nodemailer.createTransport({
    host: notificationInfo.host,
    ...(notificationInfo.port && { port: notificationInfo.port }),
    ...((notificationInfo.tlsRejectUnauthorized === true || notificationInfo.tlsRejectUnauthorized === false) && { tls: { rejectUnauthorized: notificationInfo.tlsRejectUnauthorized } }),
  });

  logger.debug('Sending email with error information');
  await transporter.sendMail({
    from: fromAddress,
    to: notificationInfo.to,
    subject: 'mCODE Extraction Client Errors',
    text: emailBody,
  });
}

module.exports = {
  sendEmailNotification,
  zipErrors,
};
