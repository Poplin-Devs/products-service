const express = require('express')
const { get, getById } = require('../database');


const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('This is the Products Service!')
});

app.get('/products', (req, res) => {
  return get(req.query.page, req.query.count)
  .then(product => {
    res.send(product);
  })
});

app.get('/products/:product_id', (req, res) => {
  let id = req.params.product_id
  return getById(id)
  .then(product => {
    res.send(product);
  })
});

app.get('/products/:product_id/styles', (req, res) => {
  let id = req.params.product_id
  return getById(id)
  .then(product => {
    res.send(product.styles);
  })
});

app.get('/products/:product_id/related', (req, res) => {
  let id = req.params.product_id
  return getById(id)
  .then(product => {
    res.send(product.relatedProducts);
  })
});


module.exports = app;