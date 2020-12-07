const _ = require('lodash');
const logger = require('../../helpers/logger');
const { ifSomeArgsObj } = require('../../helpers/templateUtils');
const { isCancerStagingSystem } = require('../../helpers/cancerStagingUtils');
const { coding } = require('./coding');

function methodTemplate({ code, system }) {
  return ifSomeArgsObj(
    ({ code: code_, system: system_ }) => ({
      method: {
        coding: [
          coding({
            ...(code_ && { code: code_ }),
            ...(system_ && { system: system_ }),
          }),
        ],
      },
    }),
  )({ code, system });
}

function stagingMethodTemplate({ code }) {
  if (isCancerStagingSystem(code)) {
    // NOTE: our general value set lookup should probably return the associate system, since it's available at the VS level
    return methodTemplate({ code, system: 'http://snomed.info/sct' });
  } if (code === 'C146985') {
    // TODO: fix this HARDCODED special case as delineated by this VS's description http://hl7.org/fhir/us/mcode/ValueSet-mcode-cancer-staging-system-vs.html
    // System based on http://hl7.org/fhir/us/mcode/Observation-mCODETNMClinicalPrimaryTumorCategoryExample01.json.html
    return methodTemplate({ code, system: 'http://ncimeta.nci.nih.gov' });
  }
  if (!_.isNull(code)) {
    logger.debug(`stagingMethodTemplate received a code ${code} that is not recognized; code will be added without a codeSystem if possible`);
  }
  return methodTemplate({ code });
}

module.exports = {
  stagingMethodTemplate,
};
