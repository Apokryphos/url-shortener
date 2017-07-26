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

//
//
//
// app.use('/', express.static(path.join(__dirname, '../public')));
//
// app.get('/', (req, res) => {
//   console.log('Serving index...');
//   res.sendFile('index.html');
// });
//
// app.get('/shorten/', (req, res) => {
//
//   longUrl = req.query.url;
//
//   if (longUrlIsValid(longUrl)) {
//     console.log('Received valid URL...');
//     urlApi.shortenUrl(longUrl)
//       .then(shortUrl => {
//         console.log('Sent short URL...');
//         res.json({
//           longUrl,
//           shortUrl,
//         });
//       })
//       .catch(err => {
//         console.log('ERROR short URL...');
//         console.error(err);
//         res.status(400).json({
//           longUrl: null,
//           shortUrl: null,
//         });
//       });
//   } else {
//     res.status(400).json({
//       longUrl: null,
//       shortUrl: null,
//     });
//   }
// });
//
// app.get('/:shortUrl', (req, res) => {
//   const shortUrl = req.params.shortUrl;
//
//   console.log(`Received short URL ${shortUrl}...`);
//   urlApi.getLongUrl(shortUrl)
//     .then(longUrl => {
//       if (longUrl) {
//         console.log(`Redirecting to ${longUrl}...`);
//         return res.redirect(302, longUrl);
//       } else {
//         res.end('URL does not exist.');
//       }
//     });
// });
