const Product = require('../model/product')

exports.getAddProduct = (req, res, next) => {
  res.render('add-product', { path: '/admin', pageTitle: 'Admin' })
}

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title)
  product.save()
  res.redirect('/')
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('cafe', { products: products, path: '/', pageTitle: 'Cafe' })
  })
}
