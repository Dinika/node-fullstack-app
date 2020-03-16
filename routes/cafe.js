const express = require('express')
const cafeController = require('../controllers/cafe')

const router = express.Router()


router.get('/favicon.ico', (req, res) => res.status(204))

router.get('/', cafeController.getProducts)
router.get('/products', cafeController.getProducts)
router.get('/cart', cafeController.getCart)
router.post('/cart', cafeController.postCart)
// router.post('/delete-cart-product', cafeController.deleteCartProduct)
// router.get('/orders', cafeController.getOrders)
router.get('/product/:productId', cafeController.getProduct)
// router.post('/checkout', cafeController.checkout)
module.exports = router