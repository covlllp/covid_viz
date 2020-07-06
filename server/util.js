const db = require('./../models');

function numToString(number, length) {
  const numString = number.toString();
  if (length <= numString.length) return numString;
  const prefix = [];
  for (let i = 0; i < length - numString.length; i++) {
    prefix.push('0');
  }
  return prefix.join('') + numString;
}

function formatDate(date) {
  return `${date.getFullYear()}-${numToString(
    date.getMonth() + 1,
    2,
  )}-${numToString(date.getDate(), 2)}`;
}

function getQuery(date) {
  return `SELECT date, Covids.county, Covids.state, Covids.fips, cases, population, cases / population * 1000000 as density from Covids INNER JOIN Counties ON Covids.fips = Counties.fips WHERE date='${formatDate(
    date,
  )}' ORDER BY density DESC`;
}

function queryCovidDensities(date) {
  const weekAgo = new Date(date.getTime());
  weekAgo.setDate(weekAgo.getDate() - 7);
  const queryToday = db.sequelize.query(getQuery(date));
  const queryWeekAgo = db.sequelize.query(getQuery(weekAgo));
  return Promise.all([queryToday, queryWeekAgo]).then(results => {
    const dataToday = results[0][0];
    const dataWeekAgo = results[1][0];
    const weekAgoMap = {};
    dataWeekAgo.forEach(point => {
      const id = point.fips;
      weekAgoMap[id] = point.density;
    });
    dataToday.forEach(point => {
      const id = point.fips;
      point.densityWeekDelta = (point.density - (weekAgoMap[id] || 0)) / 7;
    });
    return dataToday;
  });
}

module.exports = {
  queryCovidDensities,
};
