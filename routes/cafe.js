const express = require('express')
const cafeController = require('../controllers/cafe')

const router = express.Router()


router.get('/favicon.ico', (req, res) => res.status(204))

router.get('/', cafeController.getProducts)
router.get('/products', cafeController.getProducts2)
router.get('/cart', cafeController.cart)
router.get('/orders', cafeController.orders)

module.exports = router