const Product = require('../model/product')
const { validationResult } = require('express-validator/check')
const throwError = require('../utilities/throwError')

exports.getAddProduct = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login')
  }
  res.render('admin/edit-product', {
    path: '/admin/add-product',
    pageTitle: 'Add product',
    product: {},
    errorMessage: [],
    errorFields: []
  })
}

// TODO: Refactor
exports.postAddProduct = (req, res, next) => {
  const incomingProduct = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
  }
  const image = req.file
  if (!image) {
    res.status(422).render('admin/edit-product',
      {
        path: '/admin/add-product',
        pageTitle: 'Add product',
        product: incomingProduct,
        editMode: false,
        errorMessage: 'Please upload an image with .png, .jpg, .jpeg formats',
        errorFields: []
      })
    return
  }
  const imageUrl = image.path
  incomingProduct.imageUrl = imageUrl
  const errors = validationResult(req)
  const errorFields = errors.array().map(err => err.param)


  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product',
      {
        path: '/admin/add-product',
        pageTitle: 'Add product',
        product: incomingProduct,
        editMode: false,
        errorMessage: errors.array()[0].msg,
        errorFields: errorFields
      })
  }
  const product = new Product({ ...incomingProduct, userId: req.user })
  product
    .save()
    .then(result => {
      console.log("Success", result)
      res.redirect('/admin/products')
    })
    .catch(err => {
      console.log("Error", err)
      throwError(err, next)
    })
}

exports.getEditProduct = (req, res, next) => {
  Product.findById(req.params.productId)
    .then(product => {
      if (!product) {
        return res.status(404).redirect('/404')
      }
      res.render('admin/edit-product',
        {
          path: '',
          pageTitle: 'Edit product',
          product: product,
          editMode: true,
          errorMessage: [],
          errorFields: []
        })
    })
    .catch(err => {
      throwError(err, next)
    })
}

exports.postEditProduct = (req, res, next) => {
  const productId = req.params.productId
  const errors = validationResult(req)
  const errorFields = errors.array().map(err => err.param)
  const image = req.file
  const updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    _id: productId
  }
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product',
      {
        path: '',
        pageTitle: 'Edit product',
        product: updatedProduct,
        editMode: true,
        errorMessage: errors.array()[0].msg,
        errorFields: errorFields
      })
  }
  if (!productId) {
    return res.status(404).redirect('/404')
  }
  Product.findById(productId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        // Todo: Add unauthorized status to response and indicate to user
        return res.redirect('/')
      }
      // There must be a smarter way of doing this
      product.name = req.body.name
      product.description = req.body.description
      if (image) {
        product.imageUrl = image.path
      }
      product.price = req.body.price

      return product.save()
        .then(result => {
          res.redirect('/admin/products')
        })
    })
    .catch(err => {
      throwError(err, next)
    })
}

exports.deleteProduct = (req, res, next) => {
  const productId = req.params.productId
  Product
    .deleteOne({ _id: productId, userId: req.user._id })
    .then(() => {
      res.redirect('/admin/products')
    })
    .catch(err => {
      throwError(err, next)
    })
}

exports.getAdminProducts = (req, res, next) => {
  Product
    .find({ userId: req.user._id })
    .then(products => {
      res.render('admin/products.pug',
        {
          products: products,
          path: '/admin/products', pageTitle: 'Admin'
        })
    })
    .catch(err => {
      throwError(err, next)
    })
}
