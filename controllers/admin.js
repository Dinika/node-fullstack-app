const Product = require('../model/product')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', { path: '/admin/add-product', pageTitle: 'Add product' })
}

exports.getEditProduct = (req, res, next) => {
  const isEditMode = req.query.edit
  req.user.getProducts({ where: { id: req.params.productId } })
    .then(products => {
      const product = products[0]
      if (!product) {
        return res.status(404).redirect('/404')
      }
      res.render('admin/edit-product', { path: '', pageTitle: 'Edit product', product: product, editMode: true })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postAddProduct = (req, res, next) => {
  const { name, price, imageUrl, description } = req.body
  req.user.createProduct({
    name: name,
    price: price,
    imageUrl: imageUrl,
    description: description
  })
    .then(result => {
      res.redirect('/admin/products')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postEditProduct = (req, res, next) => {
  const productId = req.params.productId
  req.user.getProducts({ where: { id: productId } })
    .then((products) => {
      // If no product found, redirect to 404 page
      const product = products[0]
      if (!product) {
        return res.status(404).redirect('/404')
      }
      // Else update the product
      // Destructuring would not work if the 'name' attribute of the html element is not the same as 
      // the corresponding key name in the product model
      const { name, price, imageUrl, description } = req.body
      product.name = name
      product.price = price
      product.imageUrl = imageUrl
      product.description = description
      return product.save()
    })
    .then(result => {
      res.redirect('/admin/products')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.deleteProduct = (req, res, next) => {
  const productId = req.params.productId
  Product
    .findByPk(productId)
    .then(product => {
      return product.destroy()
    })
    .then(() => {
      res.redirect('/admin/products')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getAdminProducts = (req, res, next) => {
  req.user.getProducts()
    .then(products => {
      res.render('admin/products.pug', { products: products, path: '/admin/products', pageTitle: 'Admin' })
    })
    .catch(err => {
      console.log(err)
    })
}