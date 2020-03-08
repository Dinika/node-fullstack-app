const express = require('express')
const productController = require('../controllers/products')
const router = express.Router()

router.get('/admin', productController.getAddProduct)

router.post('/product', productController.postAddProduct)

exports.router = router;