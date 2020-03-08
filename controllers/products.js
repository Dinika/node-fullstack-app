const products = []

exports.getAddProduct = (req, res, next) => {
  res.render('add-product', { path: '/admin', pageTitle: 'Admin' })
}

exports.postAddProduct = (req, res, next) => {
  products.push({ name: req.body.title })
  res.redirect('/')
}

exports.getProducts = (req, res, next) => {
  res.render('cafe', { products: products, path: '/', pageTitle: 'Cafe' })
}
