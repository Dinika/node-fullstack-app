const express = require('express')
const order = require('./order')

const router = express.Router()


router.get('/favicon.ico', (req, res) => res.status(204))

router.get('/', (req, res, next) => {
  console.log(order.orders)
  res.render('cafe', { orders: order.orders })
})

module.exports = router