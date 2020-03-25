exports.get404 = (req, res, next) => {
  res.status(404).render('errors/404.pug', { pageTitle: 'Cafe - 404' })
}

exports.get500 = (error, req, res, next) => {
  const statusCode = error.httpStatusCode || 500
  console.warn(error)
  res.status(statusCode).render('errors/500.pug', { pageTitle: 'Cafe - 500' })
}
