const Product = require('../model/product')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', { path: '/admin/add-product', pageTitle: 'Admin' })
}

exports.postAddProduct = (req, res, next) => {
  const { name, price, imageUrl, description } = req.body
  const product = new Product(name, price, imageUrl, description)
  product.save()
  res.redirect('/')
}

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/products.pug', { products: products, path: '/admin/products', pageTitle: 'Admin' })
  })
}