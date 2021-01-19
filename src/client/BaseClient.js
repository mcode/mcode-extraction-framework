const { isValidFHIR } = require('../helpers/fhirUtils');
const logger = require('../helpers/logger');

class BaseClient {
  constructor() {
    // Lookup table mapping classNames to constructors
    this.extractorClasses = {};
    // Where instances of the actual extractors live
    this.extractors = [];
    // Where an instance of the client stores it's configuration of extractors
    this.extractorsConfig = [];
    // Constructor arguments that are shared across all extractors
    this.commonExtractorArgs = {};
  }

  // Given a list of extractorClasses, register them in our lookup table
  registerExtractors(...listOfExtractorClasses) {
    listOfExtractorClasses.forEach((extractorClass) => {
      if (extractorClass.name === undefined) {
        throw Error(`Trying to register a non-class ${extractorClass}`);
      }
      logger.debug(`Registering ${extractorClass.name} as an extractor`);
      this.extractorClasses[extractorClass.name] = extractorClass;
    });
  }

  // Given an extractor configuration, initialize all the necessary extractors
  initializeExtractors(extractorConfig, commonExtractorArgs) {
    extractorConfig.forEach((curExtractorConfig) => {
      const { label, type, constructorArgs } = curExtractorConfig;
      logger.debug(`Initializing ${label} extractor with type ${type}`);
      const ExtractorClass = this.extractorClasses[type];
      try {
        const newExtractor = new ExtractorClass({ ...commonExtractorArgs, ...constructorArgs });
        this.extractors.push(newExtractor);
      } catch (e) {
        throw new Error(`Unable to initialize ${label} extractor with type ${type}`);
      }
    });
  }

  async init() {
    return this.initializeExtractors(this.extractorConfig, this.commonExtractorArgs);
  }

  async get(args) {
    // Context is where all the responses from extractors reside
    const contextBundle = {
      resourceType: 'Bundle',
      type: 'collection',
      entry: [],
    };
    const extractionErrors = [];
    await this.extractors.reduce(async (contextPromise, extractor) => {
      const context = await contextPromise;
      try {
        logger.info(`Extracting using ${extractor.constructor.name}`);
        const newBundle = await extractor.get({ ...args, context });
        // Update existing entries or push new entries
        newBundle.entry.forEach((newEntry) => {
          const existingEntryIndex = contextBundle.entry.findIndex((contextEntry) => contextEntry.fullUrl && newEntry.fullUrl && contextEntry.fullUrl === newEntry.fullUrl);
          if (existingEntryIndex > -1) {
            contextBundle.entry[existingEntryIndex].resource = newEntry.resource;
          } else {
            contextBundle.entry.push(newEntry);
          }
        });

        return contextBundle;
      } catch (e) {
        extractionErrors.push(e);
        logger.error(e);
        logger.debug(e.stack);
        return contextBundle;
      }
    }, Promise.resolve(contextBundle));

    if (!isValidFHIR(contextBundle)) {
      logger.error('Extracted bundle is not valid FHIR.');
    }

    return { bundle: contextBundle, extractionErrors };
  }
}

module.exports = {
  BaseClient,
};
