## Online cafe store :coffee:

A node application that implements an online cafe where users can view and shop available products and administrators of the shop can manage the products available in the cafe.

## Dependencies :pushpin:

- node
- express
- mongoDB
- pug - as a templating engine
- ~~mysql~~ (Replaced by sequelize since [#d398ef45](https://github.com/Dinika/node-fullstack-app/commit/d398ef45cc4502a51f379afeba8850ba2e916ebe))
- ~~sequelize~~ (Replaced by mongoDB since [#424a1fe](https://github.com/Dinika/node-fullstack-app/commit/424a1fe4b63fe70081f0ead809555842fa9b1557))

### Development dependencies

- nodemon

## Getting Started :rocket:

1. Clone (or download) this repository

```
$ git clone https://github.com/Dinika/node-fullstack-app.git
```

2. cd into the repository folder

```
$ cd node-fullstack-app
```

3. Install all the dependencies using npm

```
$ npm install
```

If you don't have npm installed on your system click [here](https://www.npmjs.com/get-npm) for instructions on how to do that

4. Enter your mongoDB connection uri in [utilities/database.js](https://github.com/Dinika/node-fullstack-app/blob/master/utilities/database.js#L7)

5. Build and run the code

```
$ npm start
```

That's it! You should be taken on the home page of the application

## License

MIT License

## Author :angel:

Dinika Saxena

- e-mail: dinika.saxenas@gmail.com
