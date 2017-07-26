const mongodb = require('mongodb');
const ShortURL = require('./ShortURL');

function longUrlIsValid(longUrl) {
  return typeof longUrl === 'string' &&
    (longUrl.startsWith('http://') || longUrl.startsWith('https://'));
}

function getNextUrlId(db) {
  return db.collection('counters').findAndModify(
    { _id: 'urlid' },
    [],
    { $inc: { seq: 1 } },
    { new: true, },
  ).then(ret => ret.value.seq);
}

function insertUrl(db, longUrl, shortUrl) {
  const doc = {
    longUrl,
    shortUrl,
  };

  const collection = db.collection('urls');
  return collection.insert(doc).then(data => doc);
}

function createUrl(db, longUrl) {
  return getNextUrlId(db)
    .then(urlId => {
      const shortUrl = ShortURL.encode(urlId);
      return insertUrl(db, longUrl, shortUrl)
    });
}

function getExisting(db, longUrl) {
  const collection = db.collection('urls');
  return collection.findOne(
    { longUrl },
    { shortUrl: 1 });
}

function getByShortUrl(db, shortUrl) {
  const collection = db.collection('urls');
  return collection.findOne(
    { shortUrl },
    { longUrl: 1 });
}

function createOrGetShortUrl(db, longUrl) {
  return getExisting(db, longUrl)
    .then(doc => {
      if (doc) {
        return doc;
      } else {
        return createUrl(db, longUrl);
      }
    });
}

function shortenUrl(db, longUrl) {
  longUrl = encodeURIComponent(longUrl);

  return createOrGetShortUrl(db, longUrl)
    .then(doc => doc.shortUrl);
}

function getLongUrl(db, shortUrl) {
  shortUrl = encodeURIComponent(shortUrl);

  return getByShortUrl(db, shortUrl)
    .then(doc => {
      if (doc) {
        return decodeURIComponent(doc.longUrl);
      } else {
        return null;
      }
    });
}

module.exports = {
  shortenUrl,
  getLongUrl,
  longUrlIsValid,
};
