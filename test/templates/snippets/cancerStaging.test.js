const { stagingMethodTemplate } = require('../../../src/templates/snippets');
const cancerStagingSystemVS = require('../../../src/valueSets/ValueSet-mcode-cancer-staging-system-vs.json');

describe('cancerStaging snippets', () => {
  describe('stagingMethodTemplate', () => {
    const stagingCode = cancerStagingSystemVS.compose.include[0].concept[0].code;
    const stagingCodeSystem = cancerStagingSystemVS.compose.include[0].system;
    const expectedStagingMethod = {
      method: {
        code: stagingCode,
        system: stagingCodeSystem,
      },
    };
    test('it returns null when provided an empty object as an argument', () => {
      expect(stagingMethodTemplate({})).toBe(null);
    });
    test("it returns null when argument's code property is null", () => {
      expect(stagingMethodTemplate({ code: null })).toBe(null);
    });
    test('it returns an object with a well defined method property when code is in the valueset', () => {
      const stagingMethod = stagingMethodTemplate({ code: stagingCode });
      expect(stagingMethod).toEqual(expectedStagingMethod);
    });
    // Test that it returns a method when the one hardcoded case is in the VS
    test('Special case: it returns an object with a well defined method property when code is C146985', () => {
      const specialStagingCode = 'C146985';
      const specialStagingCodeSystem = 'http://ncimeta.nci.nih.gov';

      const expectedSpecialStagingMethod = {
        method: {
          code: specialStagingCode,
          system: specialStagingCodeSystem,
        },
      };
      const stagingMethod = stagingMethodTemplate({ code: specialStagingCode });
      expect(stagingMethod).toEqual(expectedSpecialStagingMethod);
    });
    // Test that it returns null when the one hardcoded case is
    test('it returns null when provided an unknown code', () => {
      const unknownStagingCode = 'anything-goes';
      expect(stagingMethodTemplate({ code: unknownStagingCode })).toBeNull();
    });
  });
});
