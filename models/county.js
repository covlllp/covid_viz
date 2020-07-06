module.exports = function(sequelize, Sequelize) {
  return sequelize.define('County', {
    county: Sequelize.TEXT,
    state: Sequelize.TEXT,
    fips: {
      type: Sequelize.TEXT,
      primaryKey: true,
    },
    population: Sequelize.FLOAT,
  });
};
