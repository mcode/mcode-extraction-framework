const path = require('path');
const { checkCodeInVs } = require('./valueSetUtils');

function isCancerStagingSystem(code) {
  const cancerStagingSystemVSPath = path.resolve(__dirname, 'valueSets', 'ValueSet-mcode-cancer-staging-system-vs.json');
  return checkCodeInVs(code, cancerStagingSystemVSPath);
}

module.exports = {
  isCancerStagingSystem,
};
