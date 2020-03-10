const express = require('express')
const adminController = require('../controllers/admin')
const router = express.Router()

router.get('/admin/add-product', adminController.getAddProduct)
router.get('/admin/edit-product/:productId', adminController.getEditProduct)
router.get('/admin/products', adminController.getAdminProducts)

router.post('/product', adminController.postAddProduct)

exports.router = router;