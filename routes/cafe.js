const express = require('express')
const productController = require('../controllers/product')

const router = express.Router()


router.get('/favicon.ico', (req, res) => res.status(204))

router.get('/', productController.getProducts)
router.get('/products', productController.getProducts2)
router.get('/cart', productController.cart)

module.exports = router