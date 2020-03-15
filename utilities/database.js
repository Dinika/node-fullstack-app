const mongodb = require('mongodb')
const mongoSecrets = require('../secrets')

const MongoClient = mongodb.MongoClient

let _db;

const mongoConnect = (callback) => {
  // Replace mongoSecrets.mongoConnectionUri with your mongo cluster connection uri
  MongoClient.connect(mongoSecrets.mongoConnectionUri)
    .then(client => {
      console.log('CONNECTED')
      _db = client.db()
      callback(client)
    })
    .catch(err => {
      console.log(err)
      throw err
    })
}

const getDB = () => {
  if (_db) {
    return _db
  }
  throw 'No database'
}

exports.mongoConnect = mongoConnect
exports.getDB = getDB