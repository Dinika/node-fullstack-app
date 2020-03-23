const express = require('express')
const router = express.Router()
const authController = require('../controllers/authentication')
const { check, body } = require('express-validator/check')
const User = require('../model/user')

router.get('/login', authController.getLogin)
router.post('/login', authController.postLogin)
router.post('/logout', authController.postLogout)
router.get('/signup', authController.getSignup)
router.post('/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Invalid e-mail')
      .custom((value, { req }) => {
        return User.findOne({ email: value })
          .then(maybeUser => {
            if (maybeUser) {
              return Promise.reject('E-mail address already exists')
            }
          })
      }),
    body('password', 'Password should be atleast 6 character long and cannot have special characters')
      .isLength({ min: 6 })
      .isAlphanumeric(),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match')
        }
        return true
      })
  ],
  authController.postSignup)
router.get('/reset-password', authController.getResetPassword)
router.post('/reset-password', authController.postResetPassword)
router.get('/new-password/:token', authController.getNewPassword)
router.post('/new-password', authController.postNewPassword)

module.exports = router