module.exports = function(sequelize, Sequelize) {
  return sequelize.define('Covid', {
    date: Sequelize.DATEONLY,
    county: Sequelize.TEXT,
    state: Sequelize.TEXT,
    fips: Sequelize.TEXT,
    cases: Sequelize.FLOAT,
    deaths: Sequelize.FLOAT,
  });
};
