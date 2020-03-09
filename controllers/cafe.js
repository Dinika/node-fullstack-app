const Product = require('../model/product')

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('cafe/product-list.pug', { products: products, path: '/', pageTitle: 'Cafe' })
  })
}

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId
  Product.findProductById(productId, product => {
    res.render('cafe/product-detail.pug', { product: product, path: '/products' })
  })
}

exports.getProducts2 = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('cafe/product-list.pug', { products: products, path: '/products', pageTitle: 'Cafe' })
  })
}

exports.getCart = (req, res, next) => {
  res.render('cafe/cart.pug', { path: '/cart', pageTitle: 'Cart' })
}

exports.postCart = (req, res, next) => {
  const productId = req.body.productId
  console.log(productId)
  res.render('cafe/cart.pug', { path: '/cart', pageTitle: 'Cart' })
}

exports.orders = (req, res, next) => {
  res.render('cafe/orders.pug', { path: '/orders', pageTitle: 'Orders' })
}
