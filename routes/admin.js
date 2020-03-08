const express = require('express')
const productController = require('../controllers/product')
const router = express.Router()

router.get('/admin', productController.getAddProduct)

router.post('/product', productController.postAddProduct)

exports.router = router;