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
      // Product already exist in cart. Update its quantity
      const productToUpdate = this.cart.items[cartProductIndex]
      this.cart.items[cartProductIndex].quantity = ++productToUpdate.quantity
    } else {
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

  getCart() {
    const db = getDB()
    const productsInCart = this.cart.items.map(i => i.productId)
    return db.collection('products')
      .find({ _id: { $in: productsInCart } })
      .toArray()
      .then(products => {
        return products.map(p => {
          return {
            ...p,
            quantity: this.cart.items.find(i => i.productId.toString() === p._id.toString()).quantity
          }
        })
      })
  }

  deleteCartItem(productId) {
    const updatedCartItems = this.cart.items.filter(i => i.productId.toString() !== productId.toString())
    return this.updateCart(updatedCartItems)
  }

  checkout() {
    const db = getDB()
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: new mongodb.ObjectID(this._id),
            name: this.name
          }
        }
        return db.collection('orders').insertOne(order)
      })
      .then(result => {
        this.cart = { items: [] }
        // Empty the cart
        this.updateCart([])
      })
      .then(result => {
        console.log("CART EMPTIED")
      })
      .catch(err => {
        console.log(err)
      })
  }

  getOrders() {
    const db = getDB()
    // db.collection('orders')
  }

  updateCart(updatedCartItems) {
    const db = getDB()
    return db.collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
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
