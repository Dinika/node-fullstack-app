const express = require('express')

const router = express.Router()

const products = [];

router.get('/admin', (req, res, next) => {
  res.render('add-product', { path: '/admin', pageTitle: 'Admin' })
})

router.post('/product', (req, res, next) => {
  products.push({ name: req.body.title })
  res.redirect('/')
})

exports.products = products;
exports.router = router;