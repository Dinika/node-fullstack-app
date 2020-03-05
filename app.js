const express = require('express')
const bodyParser = require('body-parser')
const adminRoutes = require('./routes/order')
const cafeRoutes = require('./routes/cafe')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.use(adminRoutes)
app.use(cafeRoutes)
app.use('/', function (req, res, next) {
  res.send('<h1>Page not found</h1>')
})

app.listen(4000)
