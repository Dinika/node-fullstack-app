exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.get('Cookie').split(';')[1].trim().split('=')[1] === 'true'
  res.render('authentication/login.pug', { path: '/authentication/login', pageTitle: 'Login', isLoggedIn })
}

exports.postLogin = (req, res, next) => {
  res.setHeader('Set-Cookie', 'loggedIn=true')
  res.redirect('/')
}