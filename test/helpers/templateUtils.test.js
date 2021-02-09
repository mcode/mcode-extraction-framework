const {
  ifAllArgs,
  ifAllArgsObj,
  ifSomeArgs,
  ifSomeArgsObj,
  ifSomeArgsArr,
  ifAllArgsArr,
} = require('../../src/helpers/templateUtils.js');

describe('TemplateUtils', () => {
  describe('ifAllArgs', () => {
    const fn = (a1, a2) => ({ arg1: a1, arg2: a2 });
    const ifAllArgsFn = ifAllArgs(fn);

    test('Returns nothing when all args are empty', () => {
      expect(ifAllArgsFn(undefined, undefined)).toBeNull();
      expect(ifAllArgsFn(undefined, null)).toBeNull();
      expect(ifAllArgsFn(null, undefined)).toBeNull();
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
      expect(ifAllArgsObjFn({ a1: undefined, a2: null })).toBeNull();
      expect(ifAllArgsObjFn({ a1: null, a2: undefined })).toBeNull();
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
      expect(ifAllArgsObjFn({ a1: null, a2: vStr })).toBeNull();
      // Permutations with Bool
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

  describe('ifAllArgsArr', () => {
    const arrFn = ([a1, a2]) => ({ arg1: a1, arg2: a2 });
    const ifAllArgsArrFn = ifAllArgsArr(arrFn);

    test('Returns nothing when all args are empty', () => {
      expect(ifAllArgsArrFn([undefined, undefined])).toBeNull();
      expect(ifAllArgsArrFn([undefined, null])).toBeNull();
      expect(ifAllArgsArrFn([null, undefined])).toBeNull();
      expect(ifAllArgsArrFn([null, null])).toBeNull();
    });

    test('Returns nothing when one arg is empty', () => {
      const vNum = 1;
      const vStr = '1';
      const vBool = true;
      // Permutations with Num
      expect(ifAllArgsArrFn([vNum, undefined])).toBeNull();
      expect(ifAllArgsArrFn([undefined, vNum])).toBeNull();
      expect(ifAllArgsArrFn([vNum, null])).toBeNull();
      expect(ifAllArgsArrFn([null, vNum])).toBeNull();
      // Permutations with Str
      expect(ifAllArgsArrFn([vStr, undefined])).toBeNull();
      expect(ifAllArgsArrFn([undefined, vStr])).toBeNull();
      expect(ifAllArgsArrFn([vStr, null])).toBeNull();
      expect(ifAllArgsArrFn([null, vStr])).toBeNull();
      // Permutations with Bool
      expect(ifAllArgsArrFn([vBool, undefined])).toBeNull();
      expect(ifAllArgsArrFn([undefined, vBool])).toBeNull();
      expect(ifAllArgsArrFn([vBool, null])).toBeNull();
      expect(ifAllArgsArrFn([null, vBool])).toBeNull();
    });

    test('Returns the function output when all args are present', () => {
      const a1 = 1;
      const a2 = 2;
      const output = arrFn([a1, a2]);
      expect(ifAllArgsArrFn([a1, a2])).toEqual(output);
      const vNum = 1;
      const outputNum = arrFn([vNum, vNum]);
      expect(ifAllArgsArrFn([vNum, vNum])).toEqual(outputNum);
      const vStr = '1';
      const outputStr = arrFn([vStr, vStr]);
      expect(ifAllArgsArrFn([vStr, vStr])).toEqual(outputStr);
      const vBool = true;
      const outputBool = arrFn([vBool, vBool]);
      expect(ifAllArgsArrFn([vBool, vBool])).toEqual(outputBool);
    });
  });

  describe('ifSomeArgs', () => {
    const fn = (a1, a2) => `Things to care about include ${a1 && a1}, ${a2 && a2} and of course your own happiness.`;
    const ifSomeArgsFn = ifSomeArgs(fn);

    test('Returns nothing when all args are empty', () => {
      expect(ifSomeArgsFn(undefined, undefined)).toBeNull();
      expect(ifSomeArgsFn(undefined, null)).toBeNull();
      expect(ifSomeArgsFn(null, undefined)).toBeNull();
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

    test('Returns the function output when all args are present', () => {
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
      expect(ifSomeArgsObjFn({ a1: undefined, a2: null })).toBeNull();
      expect(ifSomeArgsObjFn({ a1: null, a2: undefined })).toBeNull();
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

    test('Returns the function output when all args are present', () => {
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

  describe('ifSomeArgsArr', () => {
    const arrFn = ([a1, a2]) => ({ arg1: a1, arg2: a2, constantProp: 'This is always here' });
    const ifSomeArgsArrFn = ifSomeArgsArr(arrFn);

    test('Returns nothing when all args are empty', () => {
      expect(ifSomeArgsArrFn([undefined, undefined])).toBeNull();
      expect(ifSomeArgsArrFn([undefined, null])).toBeNull();
      expect(ifSomeArgsArrFn([null, undefined])).toBeNull();
      expect(ifSomeArgsArrFn([null, null])).toBeNull();
    });

    test('Returns the function output when one arg is empty', () => {
      // Permutations with Num
      const vNum = 1;
      expect(ifSomeArgsArrFn([vNum, undefined])).toEqual(arrFn([vNum, undefined]));
      expect(ifSomeArgsArrFn([undefined, vNum])).toEqual(arrFn([undefined, vNum]));
      expect(ifSomeArgsArrFn([vNum, null])).toEqual(arrFn([vNum, null]));
      expect(ifSomeArgsArrFn([null, vNum])).toEqual(arrFn([null, vNum]));
      // Permutations with Str
      const vStr = '1';
      expect(ifSomeArgsArrFn([vStr, undefined])).toEqual(arrFn([vStr, undefined]));
      expect(ifSomeArgsArrFn([undefined, vStr])).toEqual(arrFn([undefined, vStr]));
      expect(ifSomeArgsArrFn([vStr, null])).toEqual(arrFn([vStr, null]));
      expect(ifSomeArgsArrFn([null, vStr])).toEqual(arrFn([null, vStr]));
      // Permutations with Bool
      const vBool = true;
      expect(ifSomeArgsArrFn([vBool, undefined])).toEqual(arrFn([vBool, undefined]));
      expect(ifSomeArgsArrFn([undefined, vBool])).toEqual(arrFn([undefined, vBool]));
      expect(ifSomeArgsArrFn([vBool, null])).toEqual(arrFn([vBool, null]));
      expect(ifSomeArgsArrFn([null, vBool])).toEqual(arrFn([null, vBool]));
    });

    test('Returns the function output when all args are present', () => {
      // Permutations with Num
      const vNum = 1;
      expect(ifSomeArgsArrFn([vNum, vNum])).toEqual(arrFn([vNum, vNum]));
      // Permutations with Str
      const vStr = '1';
      expect(ifSomeArgsArrFn([vStr, vStr])).toEqual(arrFn([vStr, vStr]));
      // Permutations with Bool
      const vBool = true;
      expect(ifSomeArgsArrFn([vBool, vBool])).toEqual(arrFn([vBool, vBool]));
    });
  });
});
