const Product = require('../model/product')
const Order = require('../model/order')
const throwError = require('../utilities/throwError')
const fs = require('fs')
const path = require('path')
const rootDir = require('../utilities/rootDir')
const PDFDocument = require('pdfkit')
const stripeApiKey = require('../secrets').stripeApiKey
const stripe = require('stripe')(stripeApiKey)

const ITEMS_PER_PAGE = 2

exports.getProducts = (req, res, next) => {
  const page = req.query.page || 1
  let totalProducts
  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalProducts = numProducts
      return Product
        .find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)

    })
    .then(products => {
      const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE)
      res.render('cafe/product-list.pug',
        {
          products: products,
          path: '/',
          pageTitle: 'Cafe',
          currentPage: page,
          pageNumbers: Array.from({ length: totalPages }, (v, k) => k + 1)
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

exports.getCheckout = (req, res, next) => {
  let productsInCart
  let totalPrice = 0
  if (!req.session.user) {
    res.redirect('/')
  } else {
    req.user
      .populate('cart.items.productId')
      .execPopulate()
      .then(user => {
        productsInCart = user.cart.items
        totalPrice = productsInCart.reduce((acc, p) => {
          return acc + p.quantity * p.productId.price
        }, 0)
        return stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: productsInCart.map(p => {
            return {
              name: p.productId.name,
              description: p.productId.description,
              amount: p.productId.price * 100,
              currency: 'usd',
              quantity: p.quantity
            }
          }),
          success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
          cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
        })
      })
      .then((stripeSession) => {
        res.render(
          'cafe/checkout.pug',
          {
            path: '/checkout',
            pageTitle: 'checkout',
            productsInCart: productsInCart,
            totalPrice: totalPrice,
            sessionId: stripeSession.id
          })
      })
      .catch(err => {
        throwError(err, next)
      })
  }
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

exports.getCheckoutSuccess = (req, res, next) => {
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
      res.redirect('../orders')
    })
    .catch(err => {
      throwError(err, next)
    })
}

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId
  const fileName = `${orderId}.pdf`
  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return throwError("No order found", next, 400)
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return throwError("User not authorized to view this invoice", next, 401)
      }
      const pathToFile = path.join('data', 'invoices', fileName)
      const pdfDoc = new PDFDocument()
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`)
      pdfDoc.pipe(fs.createWriteStream(pathToFile))
      pdfDoc.pipe(res)
      pdfDoc.fontSize(26).text('Invoice', {
        underline: true
      })
      pdfDoc.text('--------------------')
      let totalPrice = 0
      order.products.forEach(p => {
        totalPrice = totalPrice + p.product.price
        pdfDoc.fontSize(16).text(p.product.name + '-' + p.quantity + 'x $' + p.product.price)
      })
      pdfDoc.text('--------------------')
      pdfDoc.text('Total: $' + totalPrice)
      pdfDoc.end()
    })
    .catch(err => {
      throwError("Error when reading file", next, 400)
    })

}