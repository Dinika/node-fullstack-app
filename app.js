const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/favicon.ico', (req, res) => res.status(204));

app.use('/add-order', (req, res, next) => {
  res.send('<form action="/order" method="POST"><input type="text" name="product"/> <button>Order</button> </form>')
})

app.post('/order', (req, res, next) => {
  console.log(req.body)
  res.redirect('/')
})

app.use('/', (req, res, next) => {
  res.send('<h1>Welcome to the Cafe</h1>')
})

app.listen(4000)
