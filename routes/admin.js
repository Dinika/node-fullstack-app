const express = require('express')

const router = express.Router()

router.get('/add-order', (req, res, next) => {
  res.send('<form action="/order" method="POST"><input type="text" name="product"/> <button>Order</button> </form>')
})

router.post('/order', (req, res, next) => {
  console.log(req.body)
  res.redirect('/')
})

module.exports = router