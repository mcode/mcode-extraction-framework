const { BaseCSVExtractor } = require('./BaseCSVExtractor');
const { firstEntryInBundle, getEmptyBundle } = require('../helpers/fhirUtils');
const { getPatientFromContext } = require('../helpers/contextUtils');
const { generateMcodeResources } = require('../templates');
const { formatDateTime } = require('../helpers/dateUtils');
const logger = require('../helpers/logger');

function formatTNMCategoryData(stagingData, patientId) {
  logger.debug('Reformatting TNM Category data into template format');
  const formattedData = [];
  const {
    conditionid: conditionId,
    t,
    n,
    m,
    type,
    stagingsystem: stagingSystem,
    stagingcodesystem: stagingCodeSystem,
    effectivedate: effectiveDate,
  } = stagingData;

  if (!conditionId || !effectiveDate) {
    throw new Error('Staging data is missing an expected property: conditionId, effectiveDate are required.');
  }

  // data needed for each TNM category
  const necessaryData = {
    conditionId,
    effectiveDateTime: formatDateTime(effectiveDate),
    stageType: type,
    stagingSystem,
    stagingCodeSystem,
    subjectId: patientId,
  };

  if (t) formattedData.push({ ...necessaryData, valueCode: t, categoryType: 'Tumor' });
  if (m) formattedData.push({ ...necessaryData, valueCode: m, categoryType: 'Metastases' });
  if (n) formattedData.push({ ...necessaryData, valueCode: n, categoryType: 'Nodes' });

  return formattedData;
}

function formatStagingData(stagingData, categoryIds, patientId) {
  const {
    conditionid: conditionId,
    type,
    stagegroup: stageGroup,
    stagingsystem: stagingSystem,
    stagingcodesystem: stagingCodeSystem,
    effectivedate: effectiveDate,
  } = stagingData;

  return {
    subjectId: patientId,
    conditionId,
    type,
    stageGroup,
    stagingSystem,
    stagingCodeSystem,
    effectiveDateTime: formatDateTime(effectiveDate),
    categoryIds,
  };
}

class CSVStagingExtractor extends BaseCSVExtractor {
  constructor({
    filePath, url, fileName, dataDirectory, csvParse,
  }) {
    super({ filePath, url, fileName, dataDirectory, csvParse });
  }

  async getStagingData(mrn) {
    logger.debug('Getting Staging data');
    return this.csvModule.get('mrn', mrn);
  }

  async get({ mrn, context }) {
    const stagingData = await this.getStagingData(mrn);
    if (stagingData.length === 0) {
      logger.warn('No Staging data found for patient');
      return getEmptyBundle();
    }
    const patientId = getPatientFromContext(context).id;

    // Iterate over the loop of staging data rows and make resources for all of them
    const entryResources = [];
    stagingData.forEach((data) => {
      const formattedCategoryData = formatTNMCategoryData(data, patientId);

      // Generate observation for each TNM category
      const mcodeCategoryResources = formattedCategoryData.map((d) => firstEntryInBundle(generateMcodeResources('TNMCategory', d)));

      // Pass category resource ids to formatStagingData
      const formattedStagingData = formatStagingData(data, mcodeCategoryResources.map((r) => r.resource.id), patientId);
      const stagingResource = firstEntryInBundle(generateMcodeResources('Staging', formattedStagingData));

      // Push all resources into entryResources
      mcodeCategoryResources.forEach((r) => entryResources.push(r));
      entryResources.push(stagingResource);
    });

    return {
      resourceType: 'Bundle',
      type: 'collection',
      entry: entryResources,
    };
  }
}

module.exports = {
  CSVStagingExtractor,
};
