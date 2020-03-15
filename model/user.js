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
    const cartProductIndex = this.cart.items.findIndex(cartItem => {
      return cartItem.productId.toString() == product._id.toString()
    })
    if (cartProductIndex > -1) {
      console.log('Here')
      // Product already exist in cart. Update its quantity
      const productToUpdate = this.cart.items[cartProductIndex]
      this.cart.items[cartProductIndex].quantity = ++productToUpdate.quantity
    } else {
      console.log('there')
      // Product doesn't exist. Add new product to cart
      this.cart.items = [
        ...this.cart.items,
        {
          productId: new mongodb.ObjectId(product._id),
          quantity: 1
        }
      ]
    }
    const updatedCart = this.cart
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
