const mongodb = require('mongodb')
const mongoSecrets = require('../secrets')

const MongoClient = mongodb.MongoClient

const mongoConnect = (callback) => {
  MongoClient.connect(mongoSecrets.mongoConnectionUri)
    .then(result => {
      console.log('CONNECTED')
      callback(result)
    })
    .catch(err => {
      console.log(err)
    })
}

module.exports = mongoConnect