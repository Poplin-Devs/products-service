// const { mongoUri } = require('../config.js');
const mongoose = require('mongoose');

let connectionString = process.env.MONGODB_ENV_CONNECTIONSTRING || 'mongodb://localhost:27017/SDC';
mongoose.connect(connectionString, () => {
  console.log('Mongoose connected to MongoDB on port 27017');
});

const photosSchema = new mongoose.Schema({
  _id: false,
  id: false,
  url: String,
  thumbnail_url: String
});

const skusSchema = new mongoose.Schema({
  _id: false,
  id: false,
  size: String,
  quantity: Number
});

const stylesSchema = new mongoose.Schema({
  _id: false,
  id: Number,
  name: String,
  sale_price: Number,
  original_price: Number,
  photos: [photosSchema],
  skus: [skusSchema]
})

const featuresSchema = new mongoose.Schema ({
  _id: false,
  id: false,
  feature: String,
  value: String
});

const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  slogan: String,
  description: String,
  category: String,
  styles: [stylesSchema],
  relatedProducts: [Number],
  features: [featuresSchema]
});

let Product = mongoose.model('Product', productSchema);

let getProducts = (page = 1, count = 5) => {

  let startingId = (page * 5) - 5;
  if (count > 5) {
    count = 5;
  }
  if (count < 1) {
    count = 1;
  }

  return Product.find({id: {$gt: startingId}}).limit(count).select({id:1, name:1, slogan:1, description:1, category:1}).lean()
  .then(product => {
    return product;
  });
}

let getProductInfo = (id) => {
  return Product.findOne({id: id}).select({id:1, name: 1, slogan: 1, description: 1, category: 1, features: 1}).lean()
  .then(product => {
    return product;
  })
}

let getProductStyles = (id) => {
  return Product.findOne({id: id}).select({id: 1, styles: 1}).lean()
  .then(product => {
    return product;
  })
}

let getProductRelated = (id) => {
  return Product.findOne({id: id}).select({relatedProducts: 1}).lean()
  .then(product => {
    return product;
  })
}

module.exports = { getProducts, getProductInfo, getProductStyles, getProductRelated };