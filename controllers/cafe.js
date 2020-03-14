const Product = require('../model/product')
const Cart = require('../model/cart')

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
  // Cart.fetchCart(cart => {
  //   Product.fetchAll(products => {
  //     const productsInCart = cart.products.map(p => {
  //       const product = products.find(prod => prod.id === p.id)
  //       const extendedProduct = { ...product, quantity: p.quantity }
  //       return extendedProduct
  //       })
  //     })
  //   })
}

exports.postCart = (req, res, next) => {
  const productId = req.body.productId
  let fetchedCart
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts({ where: { id: productId } })
    })
    .then(products => {
      const product = products.length > 0 ? products[0] : null
      const quantity = product ? 1 : 1
      return Product.findByPk(productId)
        .then(product => {
          return fetchedCart.addProduct(product, { through: { quantity: quantity } })
        })
    })
    .then(() => {
      res.status(204)
    })
    .catch(err => {
      console.log(err)
    })
}

exports.orders = (req, res, next) => {
  res.render('cafe/orders.pug', { path: '/orders', pageTitle: 'Orders' })
}

exports.deleteCartProduct = (req, res, next) => {
  Cart.deleteProduct(req.body.productId, Number(req.body.price))
  res.redirect('/')
}