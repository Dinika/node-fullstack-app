exports.login = (req, res, next) => {
  res.render('authentication/login.pug', { path: '/authentication/login', pageTitle: 'Login' })
}