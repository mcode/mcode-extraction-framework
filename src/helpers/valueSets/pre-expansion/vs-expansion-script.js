const fs = require('fs');
const path = require('path');
const axios = require('axios');
const vsPaths = require('./all-vs-path.json');

function readVsFromPath(vsPath) {
  return JSON.parse(fs.readFileSync(path.resolve(__dirname, vsPath)));
}

function writeVS(vsObj) {
  const { vsPath, vs } = vsObj;
  fs.writeFileSync(path.resolve(__dirname, '..', vsPath), JSON.stringify(vs, null, '  '));
}

function makeExpansionRequest(vsPath, vs) {
  const vsStringify = JSON.stringify(vs);

  const config = {
    method: 'post',
    url: 'http://tx.fhir.org/r4/ValueSet/$expand',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: vsStringify,
  };

  return axios(config)
    .then((response) => {
      const expansion = response.data;
      console.log(`SUCCESS: ${vsPath} was expanded`);
      return { status: 'success', vsPath, vs: expansion };
    })
    .catch((error) => {
      console.error(`FAILURE: ${vsPath} expansion failed, reverting to original VS`);
      console.error(`FAILURE: ${error.message}`);
      return { status: 'failure', vsPath, vs };
    });
}

// Aggregate requests for each vsPath we have
const requests = [];
vsPaths.forEach((vsPath) => {
  const vs = readVsFromPath(vsPath);

  requests.push(makeExpansionRequest(vsPath, vs));
});

// After all requests are finished, write the expanded files
Promise.all(requests).then((expandedValueSets) => {
  console.log('\nPost-expansion\n');
  // Print all the failed expansions
  console.log('All Failed Expansions: \n======================');
  expandedValueSets
    .filter(({ status }) => status === 'failure')
    .map(({ vsPath }) => console.log(`${vsPath}`));
  console.log('');

  // Save all the successful expansions
  expandedValueSets.forEach(writeVS);
  console.log('DONE: Wrote all files to disc');
});
