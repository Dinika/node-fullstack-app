const mongoose = require('mongoose')

const Schema = mongoose.Schema
const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [{
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true }
    }]
  }
})

userSchema.methods.addToCart = function (product) {
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
        productId: product._id,
        quantity: 1
      }
    ]
  }
  return this.save()
}

userSchema.methods.deleteCartItem = function (productId) {
  const updatedCartItems = this.cart.items.filter(i => i._id != productId)
  this.cart.items = updatedCartItems
  return this.save()
}

userSchema.methods.clearCart = function () {
  this.cart = { items: [] }
  return this.save()
}

module.exports = mongoose.model('User', userSchema)
