const path = require('path')
const fs = require('fs')
const rootDir = require('../utilities/rootDir')
const Product = require('./product')

const pathToFile = path.join(rootDir, 'data', 'cart.json')

module.exports = class Cart {

  static addProduct(id, productPrice) {
    fs.readFile(pathToFile, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 }
      if (!err) {
        cart = JSON.parse(fileContent)
      }
      let productToAdd
      const maybeProdIndex = cart.products.findIndex(p => p.id === id)
      const maybeProd = cart.products[maybeProdIndex]
      if (maybeProd) {
        productToAdd = { ...maybeProd, quantity: maybeProd.quantity + 1 }
        cart.products = [...cart.products]
        cart.products[maybeProdIndex] = productToAdd
      } else {
        productToAdd = { id: id, quantity: 1 }
        cart.products = [productToAdd, ...cart.products]
      }
      cart.totalPrice = Number((cart.totalPrice + Number(productPrice)).toFixed(2))

      fs.writeFile(pathToFile, JSON.stringify(cart), (err) => {
        console.log(err)
      })
    })
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(pathToFile, (err, fileContent) => {
      if (err) {
        console.log(err)
      } else {
        const cart = { ...(JSON.parse(fileContent)) }
        const { products, totalPrice } = cart
        const productToDelete = products.find(p => p.id === id)
        if (!productToDelete) {
          return
        }
        const updatedProducts = products.filter(p => p.id !== id)
        const updatedTotalPrice = totalPrice - productPrice * productToDelete.quantity
        const updatedCart = { products: updatedProducts, totalPrice: updatedTotalPrice }
        fs.writeFile(pathToFile, JSON.stringify(updatedCart), err => {
          if (err) console.log(err)
        })
      }
    })
  }

  static fetchCart(cb) {
    fs.readFile(pathToFile, (err, fileContent) => {
      if (err) {
        // cart is empty
        cb([], 0)
      } else {
        cb(JSON.parse(fileContent))
      }
    })
  }
}
