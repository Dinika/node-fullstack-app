const Product = require('../model/product')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', { path: '/admin/add-product', pageTitle: 'Admin' })
}

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.name)
  product.save()
  res.redirect('/')
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('cafe/product-list.pug', { products: products, path: '/', pageTitle: 'Cafe' })
  })
}

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/products.pug', { products: products, path: '/admin/products', pageTitle: 'Admin' })
  })
}

exports.getProducts2 = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('cafe/product-list.pug', { products: products, path: '/products', pageTitle: 'Cafe' })
  })
}

exports.cart = (req, res, next) => {
  res.render('cafe/cart.pug', { path: '/cart', pageTitle: 'Cart' })
}
