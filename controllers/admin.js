const Product = require('../model/product')
const mongodb = require('mongodb')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', { path: '/admin/add-product', pageTitle: 'Add product' })
}

exports.postAddProduct = (req, res, next) => {
  const { name, price, imageUrl, description } = req.body
  const product = new Product(name, price, imageUrl, description, null, req.user._id)

  product.save()
    .then(result => {
      res.redirect('/admin/products')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getEditProduct = (req, res, next) => {
  Product.findById(req.params.productId)
    .then(product => {
      if (!product) {
        return res.status(404).redirect('/404')
      }
      res.render('admin/edit-product', { path: '', pageTitle: 'Edit product', product: product, editMode: true })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postEditProduct = (req, res, next) => {
  const productId = req.params.productId
  if (!productId) {
    return res.status(404).redirect('/404')
  }
  const { name, price, imageUrl, description } = req.body
  const updatedProduct = new Product(name, price, description, imageUrl, productId)
  updatedProduct.save()
    .then(result => {
      res.redirect('/admin/products')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.deleteProduct = (req, res, next) => {
  const productId = req.params.productId
  Product
    .delete(productId)
    .then(() => {
      res.redirect('/admin/products')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('admin/products.pug', { products: products, path: '/admin/products', pageTitle: 'Admin' })
    })
    .catch(err => {
      console.log(err)
    })
}