const nock = require('nock');
const { BaseFHIRModule } = require('../../src/modules');
const operationOutcomeBundle = require('./fixtures/operation-outcome-bundle.json');

const MOCK_URL = 'http://localhost';
const MOCK_REQUEST_HEADERS = {};

// Instantiate module with mocks
const baseFHIRModule = new BaseFHIRModule(MOCK_URL, MOCK_REQUEST_HEADERS);

describe('BaseFHIRModule', () => {
  test('updateHeaders fn should update the headers variable and the clients headers', () => {
    // Ensure that the request headers are as expected initially
    const newHeaders = {
      ...MOCK_REQUEST_HEADERS,
      Authorization: 'Bearer tokenGoesHere',
    };
    baseFHIRModule.updateRequestHeaders(newHeaders);

    Object.keys(newHeaders).forEach((key) => {
      const val = newHeaders[key];
      expect(baseFHIRModule.client.httpClient.defaults.headers).toHaveProperty(key, val);
    });
  });

  test('search should make call for specified resourceType', async () => {
    const resourceType = 'Patient';
    nock(baseFHIRModule.baseUrl)
      .get(`/${resourceType}`)
      .reply(200, operationOutcomeBundle);

    const searchResults = await baseFHIRModule.search('Patient', {});
    expect(searchResults).toEqual(operationOutcomeBundle);
    // TODO: Check that the `logOperationOutcomeInfo` function in fhirUtils was called.
    // Having issues correctly spying on the function, so that test is not yet implemented.
  });
});
