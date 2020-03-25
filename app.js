const express = require('express')
const bodyParser = require('body-parser')
const admin = require('./routes/admin')
const User = require('./model/user')
const cafeRoutes = require('./routes/cafe')
const authRoutes = require('./routes/authentication')
const rootDir = require('./utilities/rootDir')
const path = require('path')
const errorController = require('./controllers/error')
const mongoose = require('mongoose')
const connectionUri = require('./secrets').mongoConnectionUri
const sessionSecret = require('./secrets').sessionSecret
const session = require('express-session')
const MongoDbStore = require('connect-mongodb-session')(session)
const csurf = require('csurf')
const flash = require('connect-flash')
const multer = require('multer')

const app = express()
const store = new MongoDbStore({
  uri: connectionUri,
  collection: 'sessions'
})
const csrfProtection = csurf()

const fileStorage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    // The name can be tweaked to use some random string instead of current date
    cb(null, `${new Date().toISOString()}-${file.originalname}`)
  }
})

app.set('view engine', 'pug')
app.set('views', 'views')

app.use(express.static(path.join(rootDir, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(multer({ storage: fileStorage }).single('image'))

app.use(
  session({ secret: sessionSecret, resave: false, saveUninitialized: false, store: store })
)
app.use(csrfProtection)
app.use(flash())

app.use((req, res, next) => {
  if (!req.session.user) {
    next()
  } else {
    User.findById(req.session.user._id)
      .then(user => {
        if (user) {
          req.user = user
        } else {
          console.warn("User stored in the session was not found in the database")
        }
        next()
      })
      .catch(err => {
        throw new Error(err)
      })
  }
})

app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use(admin.router)
app.use(cafeRoutes)
app.use(authRoutes)
app.use('/', errorController.get404)
app.use(errorController.get500)

mongoose.connect(connectionUri)
  .then(() => {
    app.listen(4000)
  })
  .catch(err => {
    console.log(err)
  })
