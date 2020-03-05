const express = require('express')
const bodyParser = require('body-parser')
const adminRoutes = require('./routes/admin')
const cafeRoutes = require('./routes/cafe')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.use(adminRoutes)
app.use(cafeRoutes)

app.listen(4000)
