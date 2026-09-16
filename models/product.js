const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    max: 1000000,
    validate: Number.isFinite,
  },
  category: {
    type: String,
    lowercase: true,
    required: true,
    enum: ['fruit', 'vegetable', 'dairy'],
  },
  farm:{
    type: Schema.Types.ObjectId,
    ref: 'Farm',
  }
});
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
