const Sequelize = require('sequelize')
const sequelize = require('../utilities/database')

const Product = sequelize.define(
  'product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
}
)

module.exports = Product

// const fs = require('fs');
// const path = require('path');
// const rootDir = require('../utilities/rootDir')
// const Cart = require('./cart')
// const db = require('../utilities/database')

// const p = path.join(
//   rootDir,
//   'data',
//   'products.json'
// );

// const getProductsFromFile = cb => {
//   fs.readFile(p, (err, fileContent) => {
//     if (err) {
//       cb([]);
//     } else {
//       cb(JSON.parse(fileContent));
//     }
//   });
// };

// module.exports = class Product {
//   constructor(name, price, imageUrl, description, id) {
//     this.id = id || Math.random().toString();
//     this.name = name;
//     this.price = price;
//     this.imageUrl = imageUrl;
//     this.description = description;
//   }

//   /*
//   * Updates existing product or inserts new product if none exists
//   */
//   upsert() {
//     return db.execute(
//       'INSERT INTO products (name, price, imageUrl, description) VALUES (?, ?, ?, ?)',
//       [this.name, this.price, this.imageUrl, this.description]
//     )
//   }

//   static delete(id) {
//     getProductsFromFile(products => {
//       let productPrice
//       const updatedProducts = products.filter(p => {
//         if (p.id === id) {
//           productPrice = p.price
//         }
//         return p.id !== id
//       })

//       fs.writeFile(p, JSON.stringify(updatedProducts), err => {
//         if (err) {
//           console.log(err)
//         }
//         else {
//           Cart.deleteProduct(id, productPrice)
//         }
//       })
//     })
//   }

//   static fetchAll() {
//     return db.execute('SELECT * FROM products')
//   }

//   static findProductById(id, cb) {
//     return db.execute('SELECT * FROM products WHERE products.id = ?', [id])
//   }

// };
