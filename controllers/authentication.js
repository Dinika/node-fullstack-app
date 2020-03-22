const User = require('../model/user')
const bcrypt = require('bcryptjs')

exports.getLogin = (req, res, next) => {
  res.render('authentication/login.pug', { path: '/authentication/login', pageTitle: 'Cafe Login', isLoggedIn: req.session.isLoggedIn })
}

exports.postLogin = (req, res, next) => {
  return User.findById('5e6ffef56ae68b3310f0d465')
    .then(user => {
      req.session.isLoggedIn = true
      req.session.user = user
      req.session.save((err) => {
        if (err) {
          console.log(err)
        }
        res.redirect('/')
      })
    })
    .catch(err => {
      console.log(err)
    })

}

exports.getSignup = (req, res, next) => {
  res.render('authentication/signup.pug', { path: '/authentication/signup', pageTitle: 'Cafe Signup', isLoggedIn: req.session.isLoggedIn })
}

exports.postSignup = (req, res, next) => {
  const { email, confirmPassword, password } = req.body

  User.findOne({ email: email })
    .then(maybeUser => {
      if (maybeUser) {
        return res.redirect('/login')
      }
      return bcrypt.hash(password, 12)
        .then(encryptedPassword => {
          const user = new User({
            email: email,
            password: encryptedPassword,
            cart: { items: [] }
          })
          return user.save()
        })
        .then(result => {
          res.redirect('/login')
        })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err)
    res.redirect('/')
  })
}