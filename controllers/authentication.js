exports.getLogin = (req, res, next) => {
  res.render('authentication/login.pug', { path: '/authentication/login', pageTitle: 'Login' })
}

exports.postLogin = (req, res, next) => {
  res.redirect('/')
}