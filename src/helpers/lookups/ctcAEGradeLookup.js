const { createInvertedLookup, createLowercaseLookup } = require('../lookupUtils');

const ctcAETextToCodeLookup = {
  'Absent Adverse Event': '0',
  'Mild Adverse Event': '1',
  'Moderate Adverse Event': '2',
  'Severe Adverse Event': '3',
  'Life Threatening or Disabling Adverse Event': '4',
  'Death Related to Adverse Event': '5',
};

const ctcAECodeToTextLookup = createInvertedLookup(ctcAETextToCodeLookup);

module.exports = {
  ctcAECodeToTextLookup: createLowercaseLookup(ctcAECodeToTextLookup),
  ctcAETextToCodeLookup: createLowercaseLookup(ctcAETextToCodeLookup),
};
