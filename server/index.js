const express = require('express');
const fs = require('fs');

const db = require('./../models');
const constants = require('./../constants');
const utils = require('./util');

const app = express();

const cache = {};

app.get('/date', (req, res) => {
  const stats = fs.statSync(constants.TIMES_PATH);
  res.json({
    date: stats.ctime,
  });
});

app.get('/data/covid/case_density/:date', (req, res) => {
  const date = new Date(parseInt(req.params.date, 10));
  console.log(`hit on case density for date ${date}`);
  const dateTime = date.getTime();
  if (cache[dateTime]) {
    console.log('cache hit');
    return res.json(cache[dateTime]);
  }
  utils
    .queryCovidDensities(date)
    .then(covids => {
      cache[dateTime] = covids;
      res.json(covids);
    })
    .catch(err => {
      console.log(err);
      cache[dateTime] = err;
      res.status(404).json(err);
    });
});

db.sequelize.sync().then(() => {
  console.log('db connected');
  app.listen(3000, () => {
    console.log('listening on port 3000');
  });
});
