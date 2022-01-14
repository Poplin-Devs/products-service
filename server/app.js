const express = require('express')
const { get } = require('../database');


const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('This is the Products Service!')
})

app.get('/product', (req, res) => {
  return get()
  .then(product => {
    res.send(product);
  })
})

module.exports = app;