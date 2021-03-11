/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-classes-per-file
const { BaseClient } = require('../../src/client/BaseClient.js');

const engine = new BaseClient();
// Reseet out Engine state before each iteration
beforeEach(() => {
  engine.extractorClasses = {
  };
  engine.extractors = [];
});

describe('BaseClient', () => {
  describe('registerExtractors', () => {
    it('should fail if array of non-classes are provided', () => {
      expect(() => engine.registerExtractors(1, 2, 3)).toThrowError();
      expect(() => engine.registerExtractors('a', 'b', 'c')).toThrowError();
      expect(() => engine.registerExtractors({}, {}, {})).toThrowError();
    });
    it('should add all classes to the extractorClasses lookup', () => {
      const extractorClasses = [
        class A {},
        class B {},
      ];
      engine.registerExtractors(...extractorClasses);
      expect(Object.keys(engine.extractorClasses)).toEqual(extractorClasses.map((klass) => klass.name));
      expect(Object.values(engine.extractorClasses)).toEqual(extractorClasses);
    });
  });

  describe('initializeExtractors', () => {
    it('should fail if extractors are missing a type', async () => {
      const extractorsWithoutType = [
        {
          label: 'Broken extractor',
          type: undefined,
        },
      ];
      await expect(engine.initializeExtractors(extractorsWithoutType)).rejects.toThrowError();
    });
    it('should fail on un-registered extractors', async () => {
      // No extractors are registered by default
      const unregisteredExtractors = [
        {
          label: 'Unregistered Extractor',
          type: 'UnregisteredExtractor',
        },
      ];
      await expect(engine.initializeExtractors(unregisteredExtractors)).rejects.toThrowError();
    });
    it('should add extractors to engine if they are registered', async () => {
      // Register classes
      const extractorClasses = [
        class Extractor {},
      ];
      engine.registerExtractors(...extractorClasses);
      // Reference those classes we've registered
      const registeredExtractors = [
        {
          label: 'Registered Extractor',
          type: 'Extractor',
        },
      ];
      await engine.initializeExtractors(registeredExtractors);
      expect(engine.extractors).toHaveLength(registeredExtractors.length);
      expect(engine.extractors[0]).toBeInstanceOf(extractorClasses[0]);
    });
  });

  describe('run', () => {
    it('should return a bundle even if there are no extractors', async () => {
      const { bundle } = await engine.get();
      expect(bundle.resourceType).toEqual('Bundle');
      expect(bundle.type).toEqual('collection');
      expect(bundle.entry).toHaveLength(0);
    });
    it('should iterate over all extractors gets, aggregating resultant entries in a bundle', async () => {
      const extractorClassesWithEntryGets = [
        class Ext1 { get() { return { entry: [{ data: 'here' }] }; }},
        class Ext2 { get() { return { entry: [{ data: 'alsoHere' }] }; }},
        class Ext3 { get() { throw new Error('Error'); }},
      ];
      engine.registerExtractors(...extractorClassesWithEntryGets);
      const registeredExtractors = [
        {
          label: 'Registered Extractor',
          type: 'Ext1',
        },
        {
          label: 'Registered Extractor',
          type: 'Ext2',
        },
        {
          label: 'Registered Extractor',
          type: 'Ext3',
        },
      ];
      await engine.initializeExtractors(registeredExtractors);
      const { bundle, extractionErrors } = await engine.get();
      expect(bundle.resourceType).toEqual('Bundle');
      expect(bundle.type).toEqual('collection');
      expect(bundle.entry.length).toEqual(2);
      expect(bundle.entry).toContainEqual(new extractorClassesWithEntryGets[0]().get().entry[0]);
      expect(bundle.entry).toContainEqual(new extractorClassesWithEntryGets[1]().get().entry[0]);
      expect(extractionErrors).toHaveLength(1);
    });
  });
});
