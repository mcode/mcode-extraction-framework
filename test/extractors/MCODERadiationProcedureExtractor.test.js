const { when } = require('jest-when');
const rewire = require('rewire');
const { MCODERadiationProcedureExtractor } = require('../../src/extractors/MCODERadiationProcedureExtractor.js');
const exampleProcedureBundle = require('./fixtures/surgical-radiation-procedure-bundle.json');

const radiationProcedureExtractorRewired = rewire('../../src/extractors/MCODERadiationProcedureExtractor.js');
const getMCODERadiationProcedures = radiationProcedureExtractorRewired.__get__('getMCODERadiationProcedures');

const MOCK_URL = 'http://example.com';
const MOCK_HEADERS = {};
const MOCK_PATIENT_MRN = 'EXAMPLE-MRN';

const extractor = new MCODERadiationProcedureExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS });
const { fhirProcedureExtractor } = extractor;

// Spy on fhirProcedureExtractor.get
const fhirProcedureExtractorSpy = jest.spyOn(fhirProcedureExtractor, 'get');

describe('MCODERadiationProcedureExtractor', () => {
  describe('getFHIRProcedures', () => {
    it('should return procedure entries for patient from FHIR search if no context', async () => {
      fhirProcedureExtractorSpy.mockClear();
      when(fhirProcedureExtractorSpy).calledWith({ mrn: MOCK_PATIENT_MRN, context: {} }).mockReturnValue(exampleProcedureBundle);
      const procedures = await extractor.getFHIRProcedures(MOCK_PATIENT_MRN, {});
      expect(fhirProcedureExtractorSpy).toHaveBeenCalled();
      expect(procedures).toEqual(exampleProcedureBundle.entry);
    });

    it('should return no procedures if search is empty', async () => {
      const emptyCollectionBundle = {
        resourceType: 'Bundle',
        type: 'collection',
        entry: [],
      };
      fhirProcedureExtractorSpy.mockClear();
      when(fhirProcedureExtractorSpy).calledWith({ mrn: MOCK_PATIENT_MRN, context: {} }).mockReturnValue(emptyCollectionBundle);
      const procedures = await extractor.getFHIRProcedures(MOCK_PATIENT_MRN, {});
      expect(fhirProcedureExtractorSpy).toHaveBeenCalled();
      expect(procedures).toEqual([]);
    });
  });

  // describe('getMCODERadiationProcedures', () => {
  //   const radiationProcedureCoding = {
  //     system: 'http://snomed.info/sct',
  //     code: '152198000',
  //     display: 'Brachytherapy (procedure)',
  //   };
  //   const otherProcedureCoding = {
  //     system: 'http://snomed.info/sct',
  //     code: '173170008',
  //     display: 'Bilobectomy of lung',
  //   };
  //   let fhirProcedures;
  //   beforeEach(() => {
  //     fhirProcedures = [
  //       {
  //         fullUrl: 'urn:uuid:abc-123',
  //         resource: {
  //           resourceType: 'Procedure',
  //           id: 'abc-123',
  //           code: {
  //             coding: [otherProcedureCoding],
  //           },
  //         },
  //       },
  //     ];
  //   });
  //   test('should return procedure that has single code in radiation procedure VS', () => {
  //     const radiationProcedure = {
  //       fullUrl: 'urn:uuid:xyz-987',
  //       resource: {
  //         resourceType: 'Procedure',
  //         id: 'xyz-987',
  //         code: {
  //           coding: [radiationProcedureCoding],
  //         },
  //       },
  //     };
  //     fhirProcedures.push(radiationProcedure);
  //     const resultingProcedures = getMCODERadiationProcedures(fhirProcedures);
  //     expect(resultingProcedures).toHaveLength(1);
  //     expect(resultingProcedures).toContain(radiationProcedure);
  //   });

  //   test('should return procedure that has any code in radiation procedure VS', () => {
  //     const radiationProcedure = {
  //       fullUrl: 'urn:uuid:xyz-987',
  //       resource: {
  //         resourceType: 'Procedure',
  //         id: 'xyz-987',
  //         code: {
  //           coding: [otherProcedureCoding, radiationProcedureCoding],
  //         },
  //       },
  //     };
  //     fhirProcedures.push(radiationProcedure);
  //     const resultingProcedures = getMCODERadiationProcedures(fhirProcedures);
  //     expect(resultingProcedures).toHaveLength(1);
  //     expect(resultingProcedures).toContain(radiationProcedure);
  //   });

  //   test('should not return procedure that has no code in radiation procedure VS', () => {
  //     const resultingProcedures = getMCODERadiationProcedures(fhirProcedures);
  //     expect(resultingProcedures).toHaveLength(0);
  //   });

  //   test('should not return procedure that has no codes', () => {
  //     const emptyProcedure = {
  //       fullUrl: 'urn:uuid:xyz-987',
  //       resource: {
  //         resourceType: 'Procedure',
  //         id: 'xyz-987',
  //         code: {
  //           coding: [],
  //         },
  //       },
  //     };
  //     fhirProcedures.push(emptyProcedure);
  //     const resultingProcedures = getMCODERadiationProcedures(fhirProcedures);
  //     expect(resultingProcedures).toHaveLength(0);
  //   });
  //   test('should return an empty list when provided an empty list of procedures', () => {
  //     const resultingProcedures = getMCODERadiationProcedures([]);
  //     expect(resultingProcedures).toHaveLength(0);
  //   });
  // });

  // describe('get', () => {
  //   test('should return a bundle with only procedures that are MCODE cancer related radiation procedures', async () => {
  //     const bundle = {
  //       resourceType: 'Bundle',
  //       type: 'collection',
  //       entry: exampleProcedureBundle.entry,
  //     };
  //     fhirProcedureExtractorSpy.mockClear();
  //     when(fhirProcedureExtractorSpy).calledWith({ mrn: MOCK_PATIENT_MRN, context: {} }).mockReturnValue(bundle);
  //     const data = await extractor.get({ mrn: MOCK_PATIENT_MRN, context: {} });
  //     expect(data.resourceType).toEqual('Bundle');
  //     expect(data.type).toEqual('collection');
  //     expect(data.entry).toBeDefined();
  //     expect(data.entry).toHaveLength(1);
  //     expect(data.entry[0].resource.code.coding[0].code).toEqual('152198000'); // Brachytherapy (procedure) - is in MCODE Cancer Related Radiation Procedure VS
  //   });
  // });
});
