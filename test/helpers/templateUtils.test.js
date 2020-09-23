const { ifAllArgs, ifAllArgsObj, ifSomeArgs, ifSomeArgsObj } = require('../../src/helpers/templateUtils.js');

describe('TemplateUtils', () => {
  describe('ifAllArgs', () => {
    const fn = (a1, a2) => ({ arg1: a1, arg2: a2 });
    const ifAllArgsFn = ifAllArgs(fn);

    test('Returns nothing when all args are empty', () => {
      expect(ifAllArgsFn(undefined, undefined)).toBeNull();
      expect(ifAllArgsFn(null, null)).toBeNull();
    });
    test('Returns nothing when one arg is empty', () => {
      // Permutations with Num
      const vNum = 1;
      expect(ifAllArgsFn(vNum, undefined)).toBeNull();
      expect(ifAllArgsFn(undefined, vNum)).toBeNull();
      expect(ifAllArgsFn(vNum, null)).toBeNull();
      expect(ifAllArgsFn(null, vNum)).toBeNull();
      // Permutations with Str
      const vStr = '1';
      expect(ifAllArgsFn(vStr, undefined)).toBeNull();
      expect(ifAllArgsFn(undefined, vStr)).toBeNull();
      expect(ifAllArgsFn(vStr, null)).toBeNull();
      expect(ifAllArgsFn(null, vStr)).toBeNull();
      // Permutations with Bool
      const vBool = true;
      expect(ifAllArgsFn(vBool, undefined)).toBeNull();
      expect(ifAllArgsFn(undefined, vBool)).toBeNull();
      expect(ifAllArgsFn(vBool, null)).toBeNull();
      expect(ifAllArgsFn(null, vBool)).toBeNull();
    });
    test('Returns the function output when all args are provided', () => {
      const a1 = 1;
      const a2 = 2;
      const output = fn(a1, a2);
      expect(ifAllArgsFn(a1, a2)).toEqual(output);
      const vNum = 1;
      const outputNum = fn(vNum, vNum);
      expect(ifAllArgsFn(vNum, vNum)).toEqual(outputNum);
      const vStr = '1';
      const outputStr = fn(vStr, vStr);
      expect(ifAllArgsFn(vStr, vStr)).toEqual(outputStr);
      const vBool = true;
      const outputBool = fn(vBool, vBool);
      expect(ifAllArgsFn(vBool, vBool)).toEqual(outputBool);
    });
  });

  describe('ifAllArgsObj', () => {
    const objFn = ({ a1, a2 }) => ({ arg1: a1, arg2: a2 });
    const ifAllArgsObjFn = ifAllArgsObj(objFn);

    test('Returns nothing when all args are empty', () => {
      expect(ifAllArgsObjFn({ a1: undefined, a2: undefined })).toBeNull();
      expect(ifAllArgsObjFn({ a1: null, a2: null })).toBeNull();
    });
    test('Returns nothing when one arg is empty', () => {
      const vNum = 1;
      const vStr = '1';
      const vBool = true;
      // Permutations with Num
      expect(ifAllArgsObjFn({ a1: vNum, a2: undefined })).toBeNull();
      expect(ifAllArgsObjFn({ a1: undefined, a2: vNum })).toBeNull();
      expect(ifAllArgsObjFn({ a1: vNum, a2: null })).toBeNull();
      expect(ifAllArgsObjFn({ a1: null, a2: vNum })).toBeNull();
      // Permutations with Str
      expect(ifAllArgsObjFn({ a1: vStr, a2: undefined })).toBeNull();
      expect(ifAllArgsObjFn({ a1: undefined, a2: vStr })).toBeNull();
      expect(ifAllArgsObjFn({ a1: vStr, a2: null })).toBeNull();
      // Permutations with Bool
      expect(ifAllArgsObjFn({ a1: null, a2: vStr })).toBeNull();
      expect(ifAllArgsObjFn({ a1: vBool, a2: undefined })).toBeNull();
      expect(ifAllArgsObjFn({ a1: undefined, a2: vBool })).toBeNull();
      expect(ifAllArgsObjFn({ a1: vBool, a2: null })).toBeNull();
      expect(ifAllArgsObjFn({ a1: null, a2: vBool })).toBeNull();
    });
    test('Returns the function output when all args are present', () => {
      const a1 = 1;
      const a2 = 2;
      const output = objFn({ a1, a2 });
      expect(ifAllArgsObjFn({ a1, a2 })).toEqual(output);
      const vNum = 1;
      const outputNum = objFn({ a1: vNum, a2: vNum });
      expect(ifAllArgsObjFn({ a1: vNum, a2: vNum })).toEqual(outputNum);
      const vStr = '1';
      const outputStr = objFn({ a1: vStr, a2: vStr });
      expect(ifAllArgsObjFn({ a1: vStr, a2: vStr })).toEqual(outputStr);
      const vBool = true;
      const outputBool = objFn({ a1: vBool, a2: vBool });
      expect(ifAllArgsObjFn({ a1: vBool, a2: vBool })).toEqual(outputBool);
    });
  });

  describe('ifSomeArgs', () => {
    const fn = (a1, a2) => `Things to care about include ${a1 && a1}, ${a2 && a2} and of course your own happiness.`;
    const ifSomeArgsFn = ifSomeArgs(fn);

    test('Returns nothing when all args are empty', () => {
      expect(ifSomeArgsFn(undefined, undefined)).toBeNull();
      expect(ifSomeArgsFn(null, null)).toBeNull();
    });
    test('Returns the function output when one arg is empty', () => {
      // Permutations with Num
      const vNum = 1;
      expect(ifSomeArgsFn(vNum, undefined)).toEqual(fn(vNum, undefined));
      expect(ifSomeArgsFn(undefined, vNum)).toEqual(fn(undefined, vNum));
      expect(ifSomeArgsFn(vNum, null)).toEqual(fn(vNum, null));
      expect(ifSomeArgsFn(null, vNum)).toEqual(fn(null, vNum));
      // Permutations with Str
      const vStr = '1';
      expect(ifSomeArgsFn(vStr, undefined)).toEqual(fn(vStr, undefined));
      expect(ifSomeArgsFn(undefined, vStr)).toEqual(fn(undefined, vStr));
      expect(ifSomeArgsFn(vStr, null)).toEqual(fn(vStr, null));
      expect(ifSomeArgsFn(null, vStr)).toEqual(fn(null, vStr));
      // Permutations with Bool
      const vBool = true;
      expect(ifSomeArgsFn(vBool, undefined)).toEqual(fn(vBool, undefined));
      expect(ifSomeArgsFn(undefined, vBool)).toEqual(fn(undefined, vBool));
      expect(ifSomeArgsFn(vBool, null)).toEqual(fn(vBool, null));
      expect(ifSomeArgsFn(null, vBool)).toEqual(fn(null, vBool));
    });
    test('Returns the function output when all args are empty', () => {
      // Permutations with Num
      const vNum = 1;
      expect(ifSomeArgsFn(vNum, vNum)).toEqual(fn(vNum, vNum));
      // Permutations with Str
      const vStr = '1';
      expect(ifSomeArgsFn(vStr, vStr)).toEqual(fn(vStr, vStr));
      // Permutations with Bool
      const vBool = true;
      expect(ifSomeArgsFn(vBool, vBool)).toEqual(fn(vBool, vBool));
    });
  });

  describe('ifSomeArgsObj', () => {
    const objFn = ({ a1, a2 }) => ({ arg1: a1, arg2: a2, constantProp: 'This is always here' });
    const ifSomeArgsObjFn = ifSomeArgsObj(objFn);

    test('Returns nothing when all args are empty', () => {
      expect(ifSomeArgsObjFn({ a1: undefined, a2: undefined })).toBeNull();
      expect(ifSomeArgsObjFn({ a1: null, a2: null })).toBeNull();
    });
    test('Returns the function output when one arg is empty', () => {
      // Permutations with Num
      const vNum = 1;
      expect(ifSomeArgsObjFn({ a1: vNum, a2: undefined })).toEqual(objFn({ a1: vNum, a2: undefined }));
      expect(ifSomeArgsObjFn({ a1: undefined, a2: vNum })).toEqual(objFn({ a1: undefined, a2: vNum }));
      expect(ifSomeArgsObjFn({ a1: vNum, a2: null })).toEqual(objFn({ a1: vNum, a2: null }));
      expect(ifSomeArgsObjFn({ a1: null, a2: vNum })).toEqual(objFn({ a1: null, a2: vNum }));
      // Permutations with Str
      const vStr = '1';
      expect(ifSomeArgsObjFn({ a1: vStr, a2: undefined })).toEqual(objFn({ a1: vStr, a2: undefined }));
      expect(ifSomeArgsObjFn({ a1: undefined, a2: vStr })).toEqual(objFn({ a1: undefined, a2: vStr }));
      expect(ifSomeArgsObjFn({ a1: vStr, a2: null })).toEqual(objFn({ a1: vStr, a2: null }));
      expect(ifSomeArgsObjFn({ a1: null, a2: vStr })).toEqual(objFn({ a1: null, a2: vStr }));
      // Permutations with Bool
      const vBool = true;
      expect(ifSomeArgsObjFn({ a1: vBool, a2: undefined })).toEqual(objFn({ a1: vBool, a2: undefined }));
      expect(ifSomeArgsObjFn({ a1: undefined, a2: vBool })).toEqual(objFn({ a1: undefined, a2: vBool }));
      expect(ifSomeArgsObjFn({ a1: vBool, a2: null })).toEqual(objFn({ a1: vBool, a2: null }));
      expect(ifSomeArgsObjFn({ a1: null, a2: vBool })).toEqual(objFn({ a1: null, a2: vBool }));
    });
    test('Returns the function output when all args are empty', () => {
      // Permutations with Num
      const vNum = 1;
      expect(ifSomeArgsObjFn({ a1: vNum, a2: vNum })).toEqual(objFn({ a1: vNum, a2: vNum }));
      // Permutations with Str
      const vStr = '1';
      expect(ifSomeArgsObjFn({ a1: vStr, a2: vStr })).toEqual(objFn({ a1: vStr, a2: vStr }));
      // Permutations with Bool
      const vBool = true;
      expect(ifSomeArgsObjFn({ a1: vBool, a2: vBool })).toEqual(objFn({ a1: vBool, a2: vBool }));
    });
  });
});
