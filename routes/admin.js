const express = require('express')
const adminController = require('../controllers/admin')
const router = express.Router()
const { body } = require('express-validator/check')

const isAuthenticated = require('../middleware/is-authenticated')

router.get('/admin/add-product', isAuthenticated, adminController.getAddProduct)
router.get('/admin/edit-product/:productId', isAuthenticated, adminController.getEditProduct)
router.get('/admin/products', isAuthenticated, adminController.getAdminProducts)

router.post('/add-product',
  [
    body('name', 'Name should be atleast 2 characters long')
      .trim()
      .isLength({ min: 2 }),
    body('imageUrl')
      .isURL()
      .trim()
      .withMessage('image url should be a valid url'),
    body('price')
      .isFloat()
      .withMessage('Price should be a numeric value (eg: 4.25)'),
    body('description')
      .trim()
      .isLength({ min: 4, max: 400 })
      .withMessage('Description should be atleast 4 characters long')
  ],
  isAuthenticated,
  adminController.postAddProduct)

router.post('/edit-product/:productId',
  [
    body('name', 'Name should be atleast 2 characters long')
      .trim()
      .isLength({ min: 2 }),
    body('imageUrl')
      .isURL()
      .trim()
      .withMessage('image url should be a valid url'),
    body('price')
      .isFloat()
      .withMessage('Price should be a numeric value (eg: 4.25)'),
    body('description')
      .trim()
      .isLength({ min: 4, max: 400 })
      .withMessage('Description should be atleast 4 characters long')
  ],
  isAuthenticated,
  adminController.postEditProduct)
router.post('/admin/delete-product/:productId', isAuthenticated, adminController.deleteProduct)

exports.router = router;