const express = require('express')
const productController = require('../controllers/products')

const router = express.Router()


router.get('/favicon.ico', (req, res) => res.status(204))

router.get('/', productController.getProducts)

module.exports = router