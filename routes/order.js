const express = require('express')
const path = require('path')
const router = express.Router()

router.get('/order', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../', 'views', 'order.html'))
})

router.post('/order', (req, res, next) => {
  console.log(req.body)
  res.redirect('/')
})

module.exports = router