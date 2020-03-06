const express = require('express')
const bodyParser = require('body-parser')
const adminRoutes = require('./routes/order')
const cafeRoutes = require('./routes/cafe')
const rootDir = require('./utilities/rootDir')
const path = require('path')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.use(adminRoutes)
app.use(cafeRoutes)
app.use('/', function (req, res, next) {
  res.sendFile(path.join(rootDir, 'views', '404.html'))
})

app.listen(4000)
