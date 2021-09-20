const { reference } = require('./reference');

function subjectTemplate({ id }) {
  return {
    subject: reference({ id, resourceType: 'Patient' }),
  };
}

module.exports = {
  subjectTemplate,
};
