const Product = require('../model/product')

exports.getProducts = (req, res, next) => {
  Product
    .findAll()
    .then(products => {
      res.render('cafe/product-list.pug', { products: products, path: '/', pageTitle: 'Cafe' })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId
  Product
    .findByPk(productId)
    .then((product) => {
      res.render('cafe/product-detail.pug', { product: product, path: '/products' })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      console.log(cart)
      return cart.getProducts()
    })
    .then(productsInCart => {
      res.render('cafe/cart.pug', { path: '/cart', pageTitle: 'Cart', productsInCart: productsInCart, totalPrice: 0 })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postCart = (req, res, next) => {
  const productId = req.body.productId
  let fetchedCart
  let newQuantity
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts({ where: { id: productId } })
    })
    .then(products => {
      const product = products.length > 0 ? products[0] : null
      newQuantity = product ? product.cartItem.quantity + 1 : 1
      return Product.findByPk(productId)
    })
    .then(product => {
      return fetchedCart.addProduct(product, { through: { quantity: newQuantity } })
    })
    .then(() => {
      res.redirect('/cart')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.orders = (req, res, next) => {
  req.user
    .getOrders({ include: ['products'] })
    .then(orders => {
      console.log("orderssss", orders)
      res.render('cafe/orders.pug', { path: '/orders', pageTitle: 'Orders', orders: orders })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.deleteCartProduct = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: req.body.productId } })
    })
    .then(productToDelete => {
      const product = productToDelete ? productToDelete[0] : null
      if (product) {
        return product.cartItem.destroy()
      }
      return
    })
    .then(result => {
      res.redirect('/cart')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.checkout = (req, res, next) => {
  let fetchedCart
  let orderedProducts
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts()
    })
    .then(products => {
      orderedProducts = products
      return req.user.createOrder()
    })
    .then(order => {
      order.addProducts(orderedProducts.map(product => {
        product.orderItem = {
          quantity: product.cartItem.quantity
        }
        return product
      }))
    })
    .then(result => {
      return fetchedCart.setProducts(null)
    })
    .then(result => {
      res.redirect('./orders')
    })
    .catch(err => {
      console.log(err)
    })
}