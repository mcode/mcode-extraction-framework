const path = require('path');
const { Extractor } = require('./Extractor');
const { FHIRProcedureExtractor } = require('./FHIRProcedureExtractor');
// const { getBundleEntriesByResourceType } = require('../helpers/fhirUtils');
const { checkCodeInVs } = require('../helpers/valueSetUtils');
const logger = require('../helpers/logger');

function getMCODESurgicalProcedures(fhirProcedures) {
  const surgicalProcedureVSFilepath = path.resolve(__dirname, '..', 'helpers', 'valueSets', 'ValueSet-mcode-cancer-related-surgical-procedure-vs.json');
  return fhirProcedures.filter((procedure) => {
    const coding = procedure.resource.code ? procedure.resource.code.coding : [];
    return coding.some((c) => checkCodeInVs(c.code, c.system, surgicalProcedureVSFilepath));
  });
}

class MCODESurgicalProcedureExtractor extends Extractor {
  constructor({ baseFhirUrl, requestHeaders }) {
    super({ baseFhirUrl, requestHeaders });
    this.fhirProcedureExtractor = new FHIRProcedureExtractor({ baseFhirUrl, requestHeaders });
  }

  updateRequestHeaders(newHeaders) {
    this.fhirProcedureExtractor.updateRequestHeaders(newHeaders);
  }

  async getFHIRProcedures(mrn, context) {
    // NOTE: This is commented out while we discuss the future of Context moving forward
    // const proceduresInContext = getBundleEntriesByResourceType(context, 'Procedure', {});
    // if (proceduresInContext.length !== 0) {
    //   logger.debug('Procedure resources found in context.');
    //   return proceduresInContext;
    // }

    logger.debug('Getting procedures available for patient');
    const procedureBundle = await this.fhirProcedureExtractor.get({ mrn, context });

    logger.debug(`Found ${procedureBundle.entry.length} result(s) in Procedure search`);
    return procedureBundle.entry;
  }

  async get({ mrn, context }) {
    const fhirProcedures = await this.getFHIRProcedures(mrn, context);

    // Filter to only include procedures that are from MCODE surgical procedure VS
    const surgicalProcedures = getMCODESurgicalProcedures(fhirProcedures);

    return {
      resourceType: 'Bundle',
      type: 'collection',
      entry: surgicalProcedures,
    };
  }
}

module.exports = {
  MCODESurgicalProcedureExtractor,
};
