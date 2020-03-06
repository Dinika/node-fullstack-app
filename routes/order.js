const express = require('express')
const path = require('path')
const rootDir = require('../utilities/rootDir')

const router = express.Router()

router.get('/order', (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', 'order.html'))
})

router.post('/order', (req, res, next) => {
  console.log(req.body)
  res.redirect('/')
})

module.exports = router