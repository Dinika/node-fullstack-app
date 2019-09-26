const http = require('http')
const express = require('express')

const app = express()

app.use('/about', (req, res, next) => {
  console.log('Middleware 1')
  res.send('<h1>Hi I am Dinika</h1>')
})

app.use('/work', (req, res, next) => {
  console.log('For now')
  res.send('<h1>I work at Minna</h1>')
})

app.use('/', (req, res, next) => {
  console.log('In other one')
  res.send('<h1>Corals!</h1>')
})

app.listen(4000)
