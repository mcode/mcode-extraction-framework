const { when } = require('jest-when');
const rewire = require('rewire');
const { MCODESurgicalProcedureExtractor } = require('../../src/extractors/MCODESurgicalProcedureExtractor.js');
const exampleProcedureBundle = require('./fixtures/surgical-procedure-bundle.json');

const surgicalProcedureExtractorRewired = rewire('../../src/extractors/MCODESurgicalProcedureExtractor.js');
const getMCODESurgicalProcedures = surgicalProcedureExtractorRewired.__get__('getMCODESurgicalProcedures');

const MOCK_URL = 'http://example.com';
const MOCK_HEADERS = {};
const MOCK_PATIENT_MRN = 'EXAMPLE-MRN';

const extractor = new MCODESurgicalProcedureExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS });
const { fhirProcedureExtractor } = extractor;

// Spy on fhirProcedureExtractor
const fhirProcedureExtractorSpy = jest.spyOn(fhirProcedureExtractor, 'get');

describe('MCODESurgicalProcedureExtractor', () => {
  describe('getFHIRProcedures', () => {
    it('should return procedure entries for patient from context', async () => {
      const contextPatient = {
        resourceType: 'Patient',
        id: 'context-patient-id',
      };
      const contextProcedure1 = {
        resourceType: 'Procedure',
        id: 'context-procedure-1-id',
      };
      const contextProcedure2 = {
        resourceType: 'Procedure',
        id: 'context-procedure-2-id',
      };
      const context = {
        resourceType: 'Bundle',
        type: 'collection',
        entry: [
          {
            fullUrl: 'context-patient-url',
            resource: contextPatient,
          },
          {
            fullUrl: 'context-procedure-1-url',
            resource: contextProcedure1,
          },
          {
            fullUrl: 'context-procedure-2-url',
            resource: contextProcedure2,
          },
        ],
      };
      const procedures = await extractor.getFHIRProcedures(MOCK_PATIENT_MRN, context);
      expect(fhirProcedureExtractorSpy).not.toHaveBeenCalled();
      expect(procedures).toHaveLength(2);
      expect(procedures[0].resource.id).toEqual(contextProcedure1.id);
      expect(procedures[1].resource.id).toEqual(contextProcedure2.id);
    });

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

  describe('getMCODESurgicalProcedures', () => {
    const otherProcedureCoding = {
      system: 'http://snomed.info/sct',
      code: '152198000',
      display: 'Brachytherapy (procedure)',
    };
    const surgicalProcedureCoding = {
      system: 'http://snomed.info/sct',
      code: '173170008',
    };
    let fhirProcedures;
    beforeEach(() => {
      fhirProcedures = [
        {
          fullUrl: 'urn:uuid:abc-123',
          resource: {
            resourceType: 'Procedure',
            id: 'abc-123',
            code: {
              coding: [otherProcedureCoding],
            },
          },
        },
      ];
    });
    test('should return procedure that has single code in surgical procedure VS', () => {
      const surgicalProcedure = {
        fullUrl: 'urn:uuid:xyz-987',
        resource: {
          resourceType: 'Procedure',
          id: 'xyz-987',
          code: {
            coding: [surgicalProcedureCoding],
          },
        },
      };
      fhirProcedures.push(surgicalProcedure);
      const resultingProcedures = getMCODESurgicalProcedures(fhirProcedures);
      expect(resultingProcedures).toHaveLength(1);
      expect(resultingProcedures).toContain(surgicalProcedure);
    });

    test('should return procedure that has any code in surgical procedure VS', () => {
      const surgicalProcedure = {
        fullUrl: 'urn:uuid:xyz-987',
        resource: {
          resourceType: 'Procedure',
          id: 'xyz-987',
          code: {
            coding: [otherProcedureCoding, surgicalProcedureCoding],
          },
        },
      };
      fhirProcedures.push(surgicalProcedure);
      const resultingProcedures = getMCODESurgicalProcedures(fhirProcedures);
      expect(resultingProcedures).toHaveLength(1);
      expect(resultingProcedures).toContain(surgicalProcedure);
    });

    test('should not return procedure that has no code in surgical procedure VS', () => {
      const resultingProcedures = getMCODESurgicalProcedures(fhirProcedures);
      expect(resultingProcedures).toHaveLength(0);
    });

    test('should not return procedure that has no codes', () => {
      const emptyProcedure = {
        fullUrl: 'urn:uuid:xyz-987',
        resource: {
          resourceType: 'Procedure',
          id: 'xyz-987',
          code: {
            coding: [],
          },
        },
      };
      fhirProcedures.push(emptyProcedure);
      const resultingProcedures = getMCODESurgicalProcedures(fhirProcedures);
      expect(resultingProcedures).toHaveLength(0);
    });
  });

  describe('get', () => {
    test('should return a bundle with only procedures that are MCODE cancer related surgical procedures', async () => {
      const context = {
        resourceType: 'Bundle',
        type: 'collection',
        entry: exampleProcedureBundle.entry,
      };
      const data = await extractor.get({ mrn: MOCK_PATIENT_MRN, context });
      expect(data.resourceType).toEqual('Bundle');
      expect(data.type).toEqual('collection');
      expect(data.entry).toBeDefined();
      expect(data.entry).toHaveLength(1);
      expect(data.entry[0].resource.code.coding[0].code).toEqual('173170008'); // Bilobectomy of lung - is in MCODE Cancer Related Surgical Procedure VS
    });
  });
});
