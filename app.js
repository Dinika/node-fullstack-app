const express = require('express')
const bodyParser = require('body-parser')
const admin = require('./routes/admin')
const cafeRoutes = require('./routes/cafe')
const rootDir = require('./utilities/rootDir')
const path = require('path')
const page404Controller = require('./controllers/error')
const sequelize = require('./utilities/database')
const Product = require('./model/product')
const User = require('./model/user')

const app = express()


app.set('view engine', 'pug')
app.set('views', 'views')

app.use(express.static(path.join(rootDir, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user
      next()
    })
    .catch(err => {
      console.log(err)
    })
})

app.use(admin.router)
app.use(cafeRoutes)
app.use('/', page404Controller.get404)

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasMany(Product)

sequelize.sync()
  .then(result => {
    return User.findByPk(1)
  })
  .then(user => {
    if (!user) {
      return User.create({ name: 'David', email: 'david@dcaro.es', password: 'password' })
    }
    return user
  })
  .then(user => {
    console.log(user)
    app.listen(4000)
  })
  .catch(err => {
    console.log(err)
  })
