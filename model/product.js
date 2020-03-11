const fs = require('fs');
const path = require('path');
const rootDir = require('../utilities/rootDir')
const Cart = require('./cart')
const db = require('../utilities/database')

const p = path.join(
  rootDir,
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(name, price, imageUrl, description, id) {
    this.id = id || Math.random().toString();
    this.name = name;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  /*
  * Updates existing product or inserts new product if none exists
  */
  upsert() {
    getProductsFromFile(products => {
      const productIndexToUpdate = products.findIndex(p => p.id === this.id)
      if (productIndexToUpdate >= 0) {
        // Product already exists. Update it
        products[productIndexToUpdate] = this
      } else {
        // Product does not exist. Insert it
        products.push(this)
      }
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err)
      })
    })
  }

  static delete(id) {
    getProductsFromFile(products => {
      let productPrice
      const updatedProducts = products.filter(p => {
        if (p.id === id) {
          productPrice = p.price
        }
        return p.id !== id
      })

      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        if (err) {
          console.log(err)
        }
        else {
          Cart.deleteProduct(id, productPrice)
        }
      })
    })
  }

  static fetchAll() {
    return db.execute('SELECT * FROM products')
  }

  static findProductById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id)
      cb(product)
    })
  }
};
