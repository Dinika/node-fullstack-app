exports.getLogin = (req, res, next) => {
  req.session.isLoggedIn = true
  res.render('authentication/login.pug', { path: '/authentication/login', pageTitle: 'Login', isLoggedIn: false })
}

exports.postLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn)
  res.redirect('/')
}