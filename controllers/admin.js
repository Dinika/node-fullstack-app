const Product = require('../model/product')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', { path: '/admin/add-product', pageTitle: 'Add product' })
}

exports.getEditProduct = (req, res, next) => {
  const isEditMode = req.query.edit
  Product.findProductById(req.params.productId, product => {
    if (!product) {
      return res.status(404).redirect('/404')
    }
    res.render('admin/edit-product', { path: '', pageTitle: 'Edit product', product: product, editMode: true })
  })
}

exports.postAddProduct = (req, res, next) => {
  const { name, price, imageUrl, description } = req.body
  const product = new Product(name, price, imageUrl, description)
  product.save()
  res.redirect('/')
}

exports.postEditProduct = (req, res, next) => {
  const productId = req.params.productId
  Product.findProductById(productId, (product) => {
    // If no product found, redirect to 404 page
    if (!product) {
      return res.status(404).redirect('/404')
    }
    // Else update the product
    // Destructuring would not work if the 'name' attribute of the html element is not the same as 
    // the corresponding key name in the product model
    const incomingUpdatedProduct = { id: productId, ...req.body }
    Product.update(productId, incomingUpdatedProduct)
    res.redirect('/admin/products')
  })
}

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/products.pug', { products: products, path: '/admin/products', pageTitle: 'Admin' })
  })
}