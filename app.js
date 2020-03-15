const express = require('express')
const bodyParser = require('body-parser')
const admin = require('./routes/admin')
const User = require('./model/user')
const cafeRoutes = require('./routes/cafe')
const rootDir = require('./utilities/rootDir')
const path = require('path')
const page404Controller = require('./controllers/error')
const mongoConnect = require('./utilities/database').mongoConnect

const app = express()


app.set('view engine', 'pug')
app.set('views', 'views')

app.use(express.static(path.join(rootDir, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use((req, res, next) => {
  User.findById('5e6e24f61a023b4bdf9ddb4d')
    .then(user => {
      req.user = new User(user.name, user.email, user.cart, user._id)
      next()
    })
    .catch(err => {
      console.log(err)
    })
})
app.use(admin.router)
app.use(cafeRoutes)
app.use('/', page404Controller.get404)

mongoConnect(() => {
  app.listen(4000)
})
