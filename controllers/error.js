exports.get404 = (req, res, next) => {
  res.status(404).render('errors/404.pug', { pageTitle: 'Cafe - 404' })
}

exports.get500 = (error, req, res, next) => {
  console.log("HEY HEY")
  console.log(error)
  res.status(error.httpStatusCode).render('errors/500.pug', { pageTitle: 'Cafe - 500' })
}
