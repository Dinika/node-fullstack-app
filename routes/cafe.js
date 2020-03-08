const express = require('express')
const path = require('path')
const rootDir = require('../utilities/rootDir')
const order = require('./order')

const router = express.Router()


router.get('/favicon.ico', (req, res) => res.status(204))

router.get('/', (req, res, next) => {
  console.log('cafe.js', order.orders)
  res.sendFile(path.join(rootDir, 'views', 'cafe.html'))
})

module.exports = router