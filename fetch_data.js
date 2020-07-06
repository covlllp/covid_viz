// Simply fetch info from NYTimes and save the date this was run
const fs = require('fs');
const fetch = require('node-fetch');
const constants = require('./constants');

function fetchAndSave(url, path) {
  console.log(`fetching from ${url}`);
  fetch(url).then(res => {
    console.log(`saving file at ${path}`);
    const dest = fs.createWriteStream(path);
    res.body.pipe(dest);
    res.body.on('finish', () => {
      console.log(`save of ${path} complete`);
    });
  });
}

fetchAndSave(constants.TIMES_URL, constants.TIMES_PATH);
fetchAndSave(constants.CENSUS_URL, constants.CENSUS_PATH);
