const User = require('../model/user')
const bcrypt = require('bcryptjs')
const nodeMailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')
const sendgridApiKey = require('../secrets').sendgridApiKey

const transporter = nodeMailer.createTransport(
  sendGridTransport({
    auth: {
      api_key: sendgridApiKey
    }
  })
)

exports.getLogin = (req, res, next) => {
  res.render('authentication/login.pug',
    {
      path: '/authentication/login',
      pageTitle: 'Cafe Login',
      errorMessage: req.flash('error')[0]
    })
}

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body
  return User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password')
        return res.redirect('/login')
      }
      bcrypt.compare(password, user.password)
        .then(isValidPassword => {
          if (isValidPassword) {
            req.session.isLoggedIn = true
            req.session.user = user
            return req.session.save((err) => {
              if (err) {
                console.error("Error when saving user session")
                console.log(err)
              }
              res.redirect('/')
            })
          } else {
            req.flash('error', 'Invalid email or password')
            return res.redirect('/login')
          }
        })
        .catch(err => {
          console.error("User lookup failed")
          res.redirect('/login')
        })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getSignup = (req, res, next) => {
  res.render('authentication/signup.pug', { path: '/authentication/signup', pageTitle: 'Cafe Signup' })
}

exports.postSignup = (req, res, next) => {
  const { email, confirmPassword, password } = req.body

  User.findOne({ email: email })
    .then(maybeUser => {
      if (maybeUser) {
        req.flash('error', 'Email already registered')
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
          return transporter.sendMail({
            to: email,
            from: 'cafe@dinika.com',
            subject: 'Signup successful',
            html: '<h1>You have successfully registered to our online cafe!</h1>'
          })
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