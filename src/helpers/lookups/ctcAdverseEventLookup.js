const { createInvertedLookup, createLowercaseLookup } = require('../lookupUtils');

const ctcAEGradeTextToCodeLookup = {
  'Absent Adverse Event': '0',
  'Mild Adverse Event': '1',
  'Moderate Adverse Event': '2',
  'Severe Adverse Event': '3',
  'Life Threatening or Disabling Adverse Event': '4',
  'Death Related to Adverse Event': '5',
};

const ctcAEGradeCodeToTextLookup = createInvertedLookup(ctcAEGradeTextToCodeLookup);

module.exports = {
  ctcAEGradeCodeToTextLookup: createLowercaseLookup(ctcAEGradeCodeToTextLookup),
  ctcAEGradeTextToCodeLookup: createLowercaseLookup(ctcAEGradeTextToCodeLookup),
};
