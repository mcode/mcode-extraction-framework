const { stagingMethodTemplate } = require('../../../src/templates/snippets');
const cancerStagingSystemVS = require('../../../src/helpers/valueSets/ValueSet-mcode-cancer-staging-system-vs.json');

describe('cancerStaging snippets', () => {
  describe('stagingMethodTemplate', () => {
    const stagingCode = cancerStagingSystemVS.compose.include[0].concept[0].code;
    const stagingCodeSystem = cancerStagingSystemVS.compose.include[0].system;
    const expectedStagingMethod = {
      method: {
        coding: [
          {
            code: stagingCode,
            system: stagingCodeSystem,
          },
        ],
      },
    };
    test('it returns null when provided an empty object as an argument', () => {
      expect(stagingMethodTemplate({})).toBe(null);
    });
    test("it returns null when argument's code property is null", () => {
      expect(stagingMethodTemplate({ code: null })).toBe(null);
    });
    test('it returns an object with a well defined method property when code is in the valueset', () => {
      const stagingMethod = stagingMethodTemplate({ code: stagingCode, system: stagingCodeSystem });
      expect(stagingMethod).toEqual(expectedStagingMethod);
    });
    test('Special case: it returns an object with a well defined method property when code is C146985', () => {
      const specialStagingCode = 'C146985';
      const specialStagingCodeSystem = 'http://ncimeta.nci.nih.gov';

      const expectedSpecialStagingMethod = {
        method: {
          coding: [
            {
              code: specialStagingCode,
              system: specialStagingCodeSystem,
            },
          ],
        },
      };
      const stagingMethod = stagingMethodTemplate({ code: specialStagingCode });
      expect(stagingMethod).toEqual(expectedSpecialStagingMethod);
    });
    test('it returns a method with a code and no system when provided an unknown code', () => {
      const unknownStagingCode = 'anything-goes';
      const unknownStagingMethod = {
        method: {
          coding: [
            {
              code: unknownStagingCode,
            },
          ],
        },
      };
      expect(stagingMethodTemplate({ code: unknownStagingCode })).toEqual(unknownStagingMethod);
    });
  });
});
