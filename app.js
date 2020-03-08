const express = require('express')
const bodyParser = require('body-parser')
const order = require('./routes/order')
const cafeRoutes = require('./routes/cafe')
const rootDir = require('./utilities/rootDir')
const path = require('path')

const app = express()
app.set('view engine', 'pug')
app.set('views', 'views')

app.use(express.static(path.join(rootDir, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))

app.use(order.router)
app.use(cafeRoutes)
app.use('/', function (req, res, next) {
  res.sendFile(path.join(rootDir, 'views', '404.html'))
})

app.listen(4000)
