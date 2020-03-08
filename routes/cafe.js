const express = require('express')
const admin = require('./admin')

const router = express.Router()


router.get('/favicon.ico', (req, res) => res.status(204))

router.get('/', (req, res, next) => {
  res.render('cafe', { products: admin.products, path: '/', pageTitle: 'Cafe' })
})

module.exports = router