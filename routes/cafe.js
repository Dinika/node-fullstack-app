const express = require('express')
const cafeController = require('../controllers/cafe')
const isAuthenticated = require('../middleware/is-authenticated')

const router = express.Router()


router.get('/favicon.ico', (req, res) => res.status(204))

router.get('/', cafeController.getProducts)
router.get('/products', cafeController.getProducts)
router.get('/cart', isAuthenticated, cafeController.getCart)
router.post('/cart', isAuthenticated, cafeController.postCart)
router.post('/delete-cart-product', isAuthenticated, cafeController.deleteCartProduct)
router.get('/orders', isAuthenticated, cafeController.getOrders)
router.get('/product/:productId', isAuthenticated, cafeController.getProduct)
router.post('/orders', isAuthenticated, cafeController.getCheckoutSuccess)
router.get('/invoice/:orderId', isAuthenticated, cafeController.getInvoice)
router.get('/checkout/success', isAuthenticated, cafeController.getCheckoutSuccess)

router.get('/checkout', isAuthenticated, cafeController.getCheckout)
router.get('/checkout/cancel', isAuthenticated, cafeController.getCheckout)

module.exports = router