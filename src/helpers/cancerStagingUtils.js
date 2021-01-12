const path = require('path');
const { checkCodeInVs } = require('./valueSetUtils');

function isCancerStagingSystem(code, system) {
  const cancerStagingSystemVSPath = path.resolve(__dirname, 'valueSets', 'ValueSet-mcode-cancer-staging-system-vs.json');
  return checkCodeInVs(code, system, cancerStagingSystemVSPath);
}

module.exports = {
  isCancerStagingSystem,
};
