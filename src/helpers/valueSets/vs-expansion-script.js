const fs = require('fs');
const path = require('path');
const axios = require('axios');

// NOTE: Update this to point to pre-expansion valuesets on your local machine
const PREEXPANSIONPATH = path.resolve('../../../../fhir-mCODE-ig/output/valuesets');

function readVsFromPath(vsPath) {
  return JSON.parse(fs.readFileSync(path.resolve(PREEXPANSIONPATH, vsPath)));
}

function writeVs(vsObj) {
  const { vsPath, vs } = vsObj;
  fs.writeFileSync(path.resolve(__dirname, vsPath), JSON.stringify(vs, null, '  '));
}

function listVsForExpansion() {
  return fs.readdirSync(PREEXPANSIONPATH);
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

function expandVs() {
  let vsPaths;
  try {
    vsPaths = listVsForExpansion();
  } catch (e) {
    console.error('FAILURE: PREEXPANSIONPATH does not point to a valid directory; make sure you update this variable based on you local machine');
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
    expandedValueSets.forEach(writeVs);
    console.log('DONE: Wrote all files to disc');
  });
}

expandVs();
