const getDB = require('../utilities/database').getDB
const mongodb = require('mongodb')

class User {
  constructor(name, email, cart, _id) {
    this.name = name
    this.email = email
    this.cart = cart
    this._id = new mongodb.ObjectId(_id)
  }

  addToCart(product) {
    // const cartProduct = this.cart.items.findIndex(product => {
    //   return cart._id === product._id
    // })

    const updatedCart = {
      items: [
        {
          productId: new mongodb.ObjectId(product._id),
          quantity: 1
        }
      ]
    }

    const db = getDB()
    return db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      )
  }

  save() {
    const db = getDB()
    return db.collection('users')
      .insertOne(this)
  }

  static findById(userId) {
    const db = getDB()
    return db.collection('users')
      .findOne({ _id: new mongodb.ObjectId(userId) })
  }
}

module.exports = User
