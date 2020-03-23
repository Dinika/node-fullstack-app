const User = require('../model/user')
const bcrypt = require('bcryptjs')
const nodeMailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')
const sendgridApiKey = require('../secrets').sendgridApiKey
const crypto = require('crypto')
const { validationResult } = require('express-validator/check')

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
      errorMessage: req.flash('error') ? req.flash('error')[0] : undefined,
      errorFields: [],
      oldInput: {
        email: '',
        password: ''
      }
    })
}

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body
  const errors = validationResult(req)
  const errorFields = errors.array().map(err => err.param)

  if (!errors.isEmpty()) {
    return res.status(422).render('authentication/login.pug',
      {
        path: '/authentication/login',
        pageTitle: 'Cafe Login',
        errorMessage: errors.array()[0] ? errors.array()[0].msg : undefined,
        errorFields: errorFields, // errorFields can't be an empty array since errors isn't empty
        oldInput: {
          email,
          password
        }
      })
  }
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
  res.render('authentication/signup.pug', {
    path: '/authentication/signup',
    pageTitle: 'Cafe Signup',
    validationErrors: [],
    errorFields: [],
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  })
}

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body
  const errors = validationResult(req)
  const errorFields = errors.array().map(err => err.param)
  if (!errors.isEmpty()) {
    return res.status(422).render('authentication/signup.pug', {
      path: '/authentication/signup',
      pageTitle: 'Cafe Signup',
      errorMessage: errors.array()[0] ? errors.array()[0].msg : undefined,
      errorFields: errorFields, // errorFields can't be an empty array since errors isn't empty
      oldInput: {
        email,
        password,
        confirmPassword
      }
    })
  }

  bcrypt.hash(password, 12)
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

exports.getResetPassword = (req, res, next) => {
  res.render('authentication/reset-password.pug',
    {
      path: '/authentication/reset-password',
      pageTitle: 'Cafe - Reset Password',
      errorMessage: req.flash('error') ? req.flash('error')[0] : undefined
    })
}

exports.postResetPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err)
      return res.redirect('/reset-password')
    }
    const token = buffer.toString('hex')
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No user with this email found')
          return res.redirect('/reset-password')
        }
        user.resetToken = token
        user.resetTokenExpiration = Date.now() + 3600000
        return user.save()
      })
      .then(result => {
        const resetLink = `http://localhost:4000/new-password/${token}`
        res.redirect('/')
        return transporter.sendMail({
          to: req.body.email,
          from: 'cafe@dinika.com',
          subject: 'Password reset',
          html: `
            <p>You requested oassword reset</p>
            <p>Click <a href=${resetLink}>here</a> to reset your password. </p>
          `
        })
      })
      .catch(err => {
        console.log(err)
      })
  })
}

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token
  User.findOne({
    resetToken: token,
    //resetTokenExpiration: { $gt: Date.now() }
  })
    .then(user => {
      return res.render('authentication/new-password.pug',
        {
          path: '/authentication/new-password',
          pageTitle: 'Cafe - New Password',
          errorMessage: req.flash('error') ? req.flash('error')[0] : undefined,
          userId: user._id.toString(),
          passwordToken: token
        })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postNewPassword = (req, res, next) => {
  const { password, userId, passwordToken } = req.body
  console.log(userId)
  let user
  User.findOne(
    {
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId
    })
    .then(maybeUser => {
      if (!maybeUser) {
        req.flash('error', 'Sorry! An error occurred when saving new password')
        return res.redirect('/login')
      }
      user = maybeUser
      return bcrypt.hash(password, 12)
    })
    .then(encryptedPassword => {
      user.password = encryptedPassword
      user.resetToken = undefined
      user.resetTokenExpiration = undefined
      return user.save()
    })
    .then(result => {
      res.redirect('/login')
    })
    .catch(err => {
      console.log(err)
    })
}