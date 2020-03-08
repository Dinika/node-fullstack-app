const express = require('express')
const path = require('path')
const rootDir = require('../utilities/rootDir')

const router = express.Router()

const products = [];

router.get('/admin', (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', 'admin.html'))
})

router.post('/product', (req, res, next) => {
  products.push({ name: req.body.title })
  res.redirect('/')
})

exports.products = products;
exports.router = router;