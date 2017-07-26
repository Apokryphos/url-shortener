const async = require('async');
const MongoClient = require('mongodb').MongoClient;

const connectionString = process.env.CONNECTION_STRING;

const databases = {
  urlShortener: async.apply(MongoClient.connect, connectionString)
};

module.exports = callback => {
  async.parallel(databases, callback);
};
