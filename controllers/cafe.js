const Product = require('../model/product')
const Order = require('../model/order')
const throwError = require('../utilities/throwError')

exports.getProducts = (req, res, next) => {
  Product
    .find()
    .then(products => {
      res.render('cafe/product-list.pug',
        {
          products: products,
          path: '/',
          pageTitle: 'Cafe'
        })
    })
    .catch(err => {
      throwError(err, next)
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
      throwError(err, next)
    })
}

exports.getCart = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/')
  } else {
    req.user
      .populate('cart.items.productId')
      .execPopulate()
      .then(user => {
        const productsInCart = user.cart.items
        res.render('cafe/cart.pug', { path: '/cart', pageTitle: 'Cart', productsInCart: productsInCart, totalPrice: 0 })
      })
      .catch(err => {
        throwError(err, next)
      })
  }
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
      throwError(err, next)
    })
}

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then(orders => {
      res.render('cafe/orders.pug', { path: '/orders', pageTitle: 'Orders', orders: orders })
    })
    .catch(err => {
      throwError(err, next)
    })
}

exports.deleteCartProduct = (req, res, next) => {
  req.user
    .deleteCartItem(req.body.productId)
    .then(result => {
      res.redirect('/cart')
    })
    .catch(err => {
      throwError(err, next)
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
          email: req.user.email,
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
      throwError(err, next)
    })
}