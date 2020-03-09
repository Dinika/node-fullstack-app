const path = require('path')
const fs = require('fs')
const rootDir = require('../utilities/rootDir')

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
      cart.totalPrice = cart.totalPrice + Number(productPrice)

      fs.writeFile(pathToFile, JSON.stringify(cart), (err) => {
        console.log(err)
      })
    })
  }
}
