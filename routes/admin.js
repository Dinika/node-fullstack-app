const express = require('express')
const productController = require('../controllers/product')
const router = express.Router()

router.get('/admin/add-product', productController.getAddProduct)
router.get('/admin/products', productController.getAdminProducts)

router.post('/product', productController.postAddProduct)

exports.router = router;