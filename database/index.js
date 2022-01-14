const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/SDC', () => {
  console.log('Mongoose connected to MongoDB on port 27017');
});

const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  slogan: String,
  description: String,
  category: String,
  styles: [
    {
      id: Number,
      name: String,
      sale_price: Number,
      original_price: Number,
      photos: [
        {
          url: String,
          thumbnail_url: String
        }
      ],
      skus: [
        {
          size: String,
          quantity: Number
        }
      ]
    }
  ],
  relatedProducts: [Number],
  features: [
    {
      feature: String,
      value: String
    }
  ]
});

let Product = mongoose.model('Product', productSchema);

let get = () => {
  return Product.find({}).limit(1)
  .then(product => {
    return product;
  });
}

module.exports = { get };