const Product = require('../model/product')
const Cart = require('../model/cart')

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([products, metadata]) => {
      res.render('cafe/product-list.pug', { products: products, path: '/', pageTitle: 'Cafe' })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId
  Product
    .findProductById(productId)
    .then(([product]) => {
      res.render('cafe/product-detail.pug', { product: product[0], path: '/products' })
    })
    .catch(err => {
      console.log(err)
    })
}
exports.getCart = (req, res, next) => {
  Cart.fetchCart(cart => {
    Product.fetchAll(products => {
      const productsInCart = cart.products.map(p => {
        const product = products.find(prod => prod.id === p.id)
        const extendedProduct = { ...product, quantity: p.quantity }
        return extendedProduct
      })
      res.render('cafe/cart.pug', { path: '/cart', pageTitle: 'Cart', productsInCart: productsInCart, totalPrice: cart.totalPrice })
    })
  })
}

exports.postCart = (req, res, next) => {
  const productId = req.body.productId
  Product.findProductById(productId, product => {
    Cart.addProduct(productId, product.price)
  })
  res.status(204)
}

exports.orders = (req, res, next) => {
  res.render('cafe/orders.pug', { path: '/orders', pageTitle: 'Orders' })
}

exports.deleteCartProduct = (req, res, next) => {
  Cart.deleteProduct(req.body.productId, Number(req.body.price))
  res.redirect('/')
}