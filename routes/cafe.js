const express = require('express')
const path = require('path')
const router = express.Router()


router.get('/favicon.ico', (req, res) => res.status(204))

router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../', 'views', 'cafe.html'))
})

module.exports = router