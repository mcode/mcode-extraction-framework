const logger = require('../../helpers/logger');
const { isCancerStagingSystem } = require('../../helpers/cancerStagingUtils');
const { coding } = require('./coding');

function stagingMethodTemplate({ code }) {
  if (isCancerStagingSystem(code)) {
    // NOTE: our general value set lookup should probably return the associate system, since it's available at the VS level
    return {
      method: coding({
        code,
        system: 'http://snomed.info/sct',
      }),
    };
  } if (code === 'C146985') {
    // TODO: fix this HARDCODED special case as delineated by this VS's description http://hl7.org/fhir/us/mcode/ValueSet-mcode-cancer-staging-system-vs.html
    // System based on http://hl7.org/fhir/us/mcode/Observation-mCODETNMClinicalPrimaryTumorCategoryExample01.json.html
    return {
      method: coding({
        code,
        system: 'http://ncimeta.nci.nih.gov',
      }),
    };
  }
  logger.warn(`stagingMethodTemplate received a code ${code} that is not recognized; code will not be added to the resulting FHIR resource`);
  return null;
}

module.exports = {
  stagingMethodTemplate,
};
