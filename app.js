const express = require('express')
const bodyParser = require('body-parser')
const admin = require('./routes/admin')
const User = require('./model/user')
const cafeRoutes = require('./routes/cafe')
const authRoutes = require('./routes/authentication')
const rootDir = require('./utilities/rootDir')
const path = require('path')
const page404Controller = require('./controllers/error')
const mongoose = require('mongoose')
const connectionUri = require('./secrets').mongoConnectionUri
const sessionSecret = require('./secrets').sessionSecret
const session = require('express-session')
const MongoDbStore = require('connect-mongodb-session')(session)

const app = express()
const store = new MongoDbStore({
  uri: connectionUri,
  collection: 'sessions'
})

app.set('view engine', 'pug')
app.set('views', 'views')

app.use(express.static(path.join(rootDir, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))

app.use(
  session({ secret: sessionSecret, resave: false, saveUninitialized: false, store: store })
)

app.use((req, res, next) => {
  if (!req.session.user) {
    next()
  } else {
    User.findById(req.session.user._id)
      .then(user => {
        req.user = user
        next()
      })
      .catch(err => {
        console.log(err)
      })
  }
})

app.use(admin.router)
app.use(cafeRoutes)
app.use(authRoutes)
app.use('/', page404Controller.get404)

mongoose.connect(connectionUri)
  .then(result => {
    return User.findOne()
  })
  .then(user => {
    if (!user) {
      const user = new User({
        name: 'Dinika',
        email: 'dinikasaxenas@gmail.com',
        cart: {
          items: []
        }
      })
      user.save()
    }
  })
  .then(() => {
    app.listen(4000)
  })
  .catch(err => {
    console.log(err)
  })
