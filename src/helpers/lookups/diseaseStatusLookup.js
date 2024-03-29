const { createInvertedLookup, createLowercaseLookup } = require('../lookupUtils');

// Code mapping is based on current values at https://hl7.org/fhir/us/mcode/ValueSet-mcode-condition-status-trend-vs.html
// along with legacy codes included at https://www.hl7.org/fhir/us/mcode/2021May/ValueSet-mcode-condition-status-trend-vs.html
const mcodeDiseaseStatusTextToCodeLookup = {
  'No abnormality detected (finding)': '281900007', // No longer in the Vs, included for backwards compatibility
  'Patient condition improved (finding)': '268910001',
  'Patient\'s condition stable (finding)': '359746009',
  'Patient\'s condition worsened (finding)': '271299001',
  'Patient condition undetermined (finding)': '709137006',
  // TODO: These are placeholder codes representing codes that are requested additions to the SNOMED vocabulary
  // They will likely need to be updated in future versions of mCODE
  'Cancer in complete remission(finding)': 'USCRS-352236',
  'Cancer in partial remission (finding)': 'USCRS-352237',
};
const mcodeDiseaseStatusCodeToTextLookup = createInvertedLookup(mcodeDiseaseStatusTextToCodeLookup);

// Code mapping is based on initial values still in use by icare implementors
// specifically using lowercase versions of the text specified by ICARE for status
// based on current values at http://standardhealthrecord.org/guides/icare/mapping_guidance.html
const icareDiseaseStatusTextToCodeLookup = {
  'no evidence of disease': '260415000',
  responding: '268910001',
  stable: '359746009',
  progressing: '271299001',
  undetermined: '709137006',
  'not evaluated': 'not-asked',
};
const icareDiseaseStatusCodeToTextLookup = createInvertedLookup(icareDiseaseStatusTextToCodeLookup);

// Code mapping is based on http://standardhealthrecord.org/guides/icare/mapping_guidance.html
// specifically using lowercase versions of the text specified by ICARE for Reason
const evidenceTextToCodeLookup = {
  imaging: '363679005',
  pathology: '252416005',
  symptoms: '711015009',
  'physical exam': '5880005',
  'lab results': '386344002',
};
const evidenceCodeToTextLookup = createInvertedLookup(evidenceTextToCodeLookup);

module.exports = {
  mcodeDiseaseStatusTextToCodeLookup: createLowercaseLookup(mcodeDiseaseStatusTextToCodeLookup),
  mcodeDiseaseStatusCodeToTextLookup: createLowercaseLookup(mcodeDiseaseStatusCodeToTextLookup),
  icareDiseaseStatusTextToCodeLookup: createLowercaseLookup(icareDiseaseStatusTextToCodeLookup),
  icareDiseaseStatusCodeToTextLookup: createLowercaseLookup(icareDiseaseStatusCodeToTextLookup),
  evidenceTextToCodeLookup: createLowercaseLookup(evidenceTextToCodeLookup),
  evidenceCodeToTextLookup: createLowercaseLookup(evidenceCodeToTextLookup),
};
