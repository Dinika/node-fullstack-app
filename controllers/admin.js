const Product = require('../model/product')
const mongoose = require('mongoose')
const { validationResult } = require('express-validator/check')

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

exports.postAddProduct = (req, res, next) => {
  const { name, price, imageUrl, description } = req.body
  const errors = validationResult(req)
  const errorFields = errors.array().map(err => err.param)
  const productToBeFixed = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    imageUrl: req.body.imageUrl
  }
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product',
      {
        path: '',
        pageTitle: 'Add product',
        product: productToBeFixed,
        editMode: false,
        errorMessage: errors.array()[0].msg,
        errorFields: errorFields
      })
  }

  const product = new Product({ name, price, imageUrl, description, userId: req.user })
  product
    .save()
    .then(result => {
      res.redirect('/admin/products')
    })
    .catch(err => {
      res.redirect('/500')
      console.log(err)
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
      console.log(err)
    })
}

exports.postEditProduct = (req, res, next) => {
  const productId = req.params.productId
  const errors = validationResult(req)
  const errorFields = errors.array().map(err => err.param)
  const productToBeFixed = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    imageUrl: req.body.imageUrl,
    _id: productId
  }
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product',
      {
        path: '',
        pageTitle: 'Edit product',
        product: productToBeFixed,
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
        return res.redirect('/')
      }
      // There must be a smarter way of doing this
      product.name = req.body.name
      product.description = req.body.description
      product.imageUrl = req.body.imageUrl
      product.price = req.body.price
      return product.save()
        .then(result => {
          res.redirect('/admin/products')
        })
    })
    .catch(err => {
      console.log(err)
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
      console.log(err)
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
      console.log(err)
    })
}