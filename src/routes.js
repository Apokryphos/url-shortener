const path = require('path');
const urlApi = require('./url-api');

module.exports = function (app, db) {

  app.get('/', (req, res) => {
    res.sendFile('index.html');
  });

  app.get('/shorten/', (req, res) => {

    const longUrl = req.query.url;

    if (urlApi.longUrlIsValid(longUrl)) {
      urlApi.shortenUrl(db, longUrl)
        .then(shortUrl => {
          res.json({
            longUrl,
            shortUrl,
          });
        })
        .catch(err => {
          console.error(err);
          res.status(400).json({
            error: "An error occured while shortening the URL. Please try again later.",
          });
        });
    } else {
      res.status(400).json({
        error: "The specified URL is not in an accepted format.",
      });
    }
  });

  app.get('/:shortUrl', (req, res) => {
    const shortUrl = req.params.shortUrl;

    urlApi.getLongUrl(db, shortUrl)
      .then(longUrl => {
        if (longUrl) {
          return res.redirect(302, longUrl);
        } else {
          res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
        }
      });
  });

};
