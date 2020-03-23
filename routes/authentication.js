const express = require('express')
const router = express.Router()
const authController = require('../controllers/authentication')
const { check } = require('express-validator/check')

router.get('/login', authController.getLogin)
router.post('/login', authController.postLogin)
router.post('/logout', authController.postLogout)
router.get('/signup', authController.getSignup)
router.post('/signup',
  check('email')
    .isEmail()
    .withMessage('Invalid e-mail')
    .custom((value, { req }) => {
      if (value === 'test@test.com') {
        throw new Error('This email address is forbidden')
      }
      return true
    }),
  authController.postSignup)
router.get('/reset-password', authController.getResetPassword)
router.post('/reset-password', authController.postResetPassword)
router.get('/new-password/:token', authController.getNewPassword)
router.post('/new-password', authController.postNewPassword)

module.exports = router