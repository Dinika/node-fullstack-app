const Product = require('../model/product')

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('cafe/product-list.pug', { products: products, path: '/', pageTitle: 'Cafe' })
  })
}

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId
  console.log(productId)
  res.redirect('/')
}

exports.getProducts2 = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('cafe/product-list.pug', { products: products, path: '/products', pageTitle: 'Cafe' })
  })
}

exports.cart = (req, res, next) => {
  res.render('cafe/cart.pug', { path: '/cart', pageTitle: 'Cart' })
}

exports.orders = (req, res, next) => {
  res.render('cafe/orders.pug', { path: '/orders', pageTitle: 'Orders' })
}
