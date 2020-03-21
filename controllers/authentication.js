const User = require('../model/user')

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

}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err)
    res.redirect('/')
  })
}