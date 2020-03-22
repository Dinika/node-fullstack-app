const express = require('express')
const adminController = require('../controllers/admin')
const router = express.Router()
const isAuthenticated = require('../middleware/is-authenticated')

router.get('/admin/add-product', isAuthenticated, adminController.getAddProduct)
router.get('/admin/edit-product/:productId', isAuthenticated, adminController.getEditProduct)
router.get('/admin/products', isAuthenticated, adminController.getAdminProducts)

router.post('/add-product', isAuthenticated, adminController.postAddProduct)
router.post('/edit-product/:productId', isAuthenticated, adminController.postEditProduct)
router.post('/admin/delete-product/:productId', isAuthenticated, adminController.deleteProduct)

exports.router = router;