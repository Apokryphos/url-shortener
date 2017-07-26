require('dotenv').config();

const express = require('express');
const initializeDatabase = require('./datastore.js');
const path = require('path');
const routes = require('./routes.js');

const app = express();
const port = process.argv[2] || process.env.PORT;

initializeDatabase(function (err, db) {

  if (err) {
    console.error('Failed to initialize database connections.');
    console.error(err);
    process.exit(1);
  }

  app.use('/', express.static(path.join(__dirname, '../public')));

  routes(app, db.urlShortener);

  const listener = app.listen(port, () => {
    console.log(`Listening on port ${listener.address().port}...`);
  });
});
