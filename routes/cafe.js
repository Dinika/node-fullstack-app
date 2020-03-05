const express = require('express')

const router = express.Router()


router.get('/favicon.ico', (req, res) => res.status(204))

router.get('/', (req, res, next) => {
  res.send('<h1>Welcome to the Cafe</h1>')
})

module.exports = router