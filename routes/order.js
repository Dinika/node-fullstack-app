const express = require('express')
const path = require('path')
const rootDir = require('../utilities/rootDir')

const router = express.Router()

const orders = [];

router.get('/order', (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', 'order.html'))
})

router.post('/order', (req, res, next) => {
  orders.push({ name: req.body.title })
  res.redirect('/')
})

exports.orders = orders;
exports.router = router;