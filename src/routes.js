const path = require('path');
const urlApi = require('./url-api');

module.exports = function (app, db) {

  app.get('/', (req, res) => {
    res.sendFile('index.html');
  });

  app.get('/shorten/', (req, res) => {

    const longUrl = req.query.url;

    if (urlApi.longUrlIsValid(longUrl)) {
      console.log('Received valid URL...');
      urlApi.shortenUrl(db, longUrl)
        .then(shortUrl => {
          console.log('Sent short URL...');
          res.json({
            longUrl,
            shortUrl,
          });
        })
        .catch(err => {
          console.log('ERROR short URL...');
          console.error(err);
          res.status(400).json({
            longUrl: null,
            shortUrl: null,
          });
        });
    } else {
      res.status(400).json({
        longUrl: null,
        shortUrl: null,
      });
    }
  });

  app.get('/:shortUrl', (req, res) => {
    const shortUrl = req.params.shortUrl;

    console.log(`Received short URL ${shortUrl}...`);
    urlApi.getLongUrl(db, shortUrl)
      .then(longUrl => {
        if (longUrl) {
          console.log(`Redirecting to ${longUrl}...`);
          return res.redirect(302, longUrl);
        } else {
          res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
        }
      });
  });

};
