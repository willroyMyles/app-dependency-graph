const mongoose = require('mongoose');
/**
 * Set to Node.js native promises
 * Per http://mongoosejs.com/docs/promises.html
 */
mongoose.Promise = global.Promise;

// Cosmos DB Connection String
// eslint-disable-next-line max-len
const mongoUri = process.env.MONGODB_URI;
// &replicaSet=globaldb`;

// Local MongoDB Connection String
// const mongoUri = `mongodb://localhost:27017/connect-heroes`;

function connect() {
  mongoose.set('debug', true);
  return mongoose.connect(mongoUri, { useNewUrlParser: true, dbName: process.env.MONGODB_DATABASE_NAME });
}

module.exports = {
  connect,
  mongoose
};