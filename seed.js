const csv = require('csv-parser');
const fs = require('fs');

const constants = require('./constants');
const db = require('./models');

function seedCovidData() {
  console.log('seeding covid data');
  return new Promise(resolve => {
    const covids = [];

    // Read covid data
    fs.createReadStream(constants.TIMES_PATH)
      .pipe(csv())
      .on('data', row => {
        const covid = {
          date: new Date(row.date),
          county: row.county,
          state: row.state,
          fips: row.fips,
          cases: parseFloat(row.cases) || 0,
          deaths: parseFloat(row.deaths) || 0,
        };
        covids.push(covid);
      })
      .on('end', () => {
        console.log('adding covid items to db');
        db.Covid.bulkCreate(covids).then(() => {
          resolve(covids);
        });
      });
  });
}

function seedCensusData() {
  console.log('seeding census data');
  return new Promise(resolve => {
    const counties = [];

    // Read counties data
    fs.createReadStream(constants.CENSUS_PATH)
      .pipe(csv())
      .on('data', row => {
        const countyNum = parseInt(row.COUNTY, 10) || 0;
        if (!countyNum) return;

        const fips = row.STATE + row.COUNTY;
        const population = parseFloat(row.POPESTIMATE2019) || 0;
        const county = {
          county: row.CTYNAME,
          state: row.STNAME,
          fips,
          population,
        };
        counties.push(county);
      })
      .on('end', () => {
        console.log('adding county items to db');
        db.County.bulkCreate(counties).then(() => {
          resolve(counties);
        });
      });
  });
}

async function seed() {
  console.log('syncing db');
  await db.sequelize.sync({ force: true }).then(console.log('tables synced'));

  Promise.all([seedCovidData(), seedCensusData()]).then(() => {
    db.sequelize.close().then(() => {
      console.log('connection closed');
    });
  });
}

seed();
