const http = require('http')
const express = require('express')

const app = express()

app.use((req, res, next) => {
  console.log('In middleware')
  next()
})

app.use((req, res, next) => {
  console.log('In other one')
  res.send('<h1>Corals!</h1>')
})

const server = http.createServer(app)
server.listen(4000)