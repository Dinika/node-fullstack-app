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
  Product.create({
    name: name,
    price: price,
    imageUrl: imageUrl,
    description: description
  })
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
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
    const { name, price, imageUrl, description } = req.body
    const incomingUpdatedProduct = new Product(name, price, imageUrl, description, productId)
    incomingUpdatedProduct
      .upsert()
      .then(() => {
        res.redirect('/admin/products')
      })
      .catch(err => console.log(err))
  })
}

exports.deleteProduct = (req, res, next) => {
  const productId = req.params.productId
  Product.delete(productId)
  res.redirect('/admin/products')
}

exports.getAdminProducts = (req, res, next) => {
  Product
    .findAll()
    .then(products => {
      res.render('admin/products.pug', { products: products, path: '/admin/products', pageTitle: 'Admin' })
    })
    .catch(err => {
      console.log(err)
    })
}