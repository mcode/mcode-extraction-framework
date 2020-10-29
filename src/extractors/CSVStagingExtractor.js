const path = require('path');
const { Extractor } = require('./Extractor');
const { CSVModule } = require('../modules');
const { firstEntryInBundle } = require('../helpers/fhirUtils');
const { generateMcodeResources } = require('../templates');
const logger = require('../helpers/logger');

function formatTNMCategoryData(stagingData) {
  logger.debug('Reformatting TNM Category data into template format');
  const formattedData = [];
  const {
    mrn, conditionId, t, m, n, type, effectiveDate,
  } = stagingData;

  if (!mrn || !conditionId || !effectiveDate) {
    throw new Error('Staging data is missing an expected property: mrn, conditionId, effectiveDate are required.');
  }

  // data needed for each TNM category
  const necessaryData = {
    conditionId,
    type,
    effectiveDate,
    subjectId: mrn,
  };

  if (t) formattedData.push({ ...necessaryData, valueCode: t, categoryType: 'Tumor' });
  if (m) formattedData.push({ ...necessaryData, valueCode: m, categoryType: 'Metastases' });
  if (n) formattedData.push({ ...necessaryData, valueCode: n, categoryType: 'Nodes' });

  return formattedData;
}

function formatStagingData(stagingData, categoryIds) {
  const {
    mrn, conditionId, type, stageGroup, effectiveDate
  } = stagingData;

  return {
    subjectId: mrn,
    conditionId,
    type,
    stageGroup,
    effectiveDate,
    categoryIds,
  };
}

class CSVStagingExtractor extends Extractor {
  constructor({ filePath }) {
    super();
    this.csvModule = new CSVModule(path.resolve(filePath));
  }

  async getStagingData(mrn) {
    logger.debug('Getting Staging data');
    return this.csvModule.get('mrn', mrn);
  }

  async get({ mrn }) {
    const stagingData = await this.getStagingData(mrn);
    const formattedCategoryData = formatTNMCategoryData(stagingData);

    // Generate observation for each TNM category
    const mcodeCategoryResources = formattedCategoryData.map((d) => firstEntryInBundle(generateMcodeResources('TNMCategory', d)));

    // Pass category resource ids to formatStagingData
    const formattedStagingData = formatStagingData(stagingData, mcodeCategoryResources.map((r) => r.id));
    const stagingResource = firstEntryInBundle(generateMcodeResources('Staging', formattedStagingData));

    return {
      resourceType: 'Bundle',
      type: 'collection',
      entry: [...mcodeCategoryResources, stagingResource],
    };
  }
}

module.exports = {
  CSVStagingExtractor,
};
