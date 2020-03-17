const Product = require('../model/product')
const Order = require('../model/order')

exports.getProducts = (req, res, next) => {
  Product
    .find()
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
    .findById(productId)
    .then((product) => {
      res.render('cafe/product-detail.pug', { product: product, path: '/products' })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const productsInCart = user.cart.items
      res.render('cafe/cart.pug', { path: '/cart', pageTitle: 'Cart', productsInCart: productsInCart, totalPrice: 0 })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postCart = (req, res, next) => {
  const productId = req.body.productId
  Product.findById(productId)
    .then(product => {
      return req.user.addToCart(product)
    })
    .then(result => {
      res.redirect('/cart')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders => {
      res.render('cafe/orders.pug', { path: '/orders', pageTitle: 'Orders', orders: orders })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.deleteCartProduct = (req, res, next) => {
  req.user
    .deleteCartItem(req.body.productId)
    .then(result => {
      res.redirect('/cart')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.checkout = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const productsInCart = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } }
      })
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products: productsInCart
      })
      order.save()
    })
    .then(() => {
      return req.user.clearCart()
    })
    .then(result => {
      res.redirect('./orders')
    })
    .catch(err => {
      console.log(err)
    })
}