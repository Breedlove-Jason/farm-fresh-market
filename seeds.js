const mongoose = require('mongoose');
const Product = require('./models/product');
mongoose
  .connect('mongodb://localhost:27017/farmStand')
  .then(() => {
    console.log('✅-->MongoDB connected successfully! ✅');
  })
  .catch((err) => {
    console.log('❌MongoDB connection failed! ❌');
    console.log(err);
  });

const p = new Product({
  name: 'Ruby Grapefruit',
  price: 1.99,
  category: 'fruit',
});
// p.save()
//   .then((p) => {
//     console.log('Product saved successfully!');
//     console.log(p);
//   })
//   .catch((err) => {
//     console.log('Error saving product:');
//     console.log(err);
//   });
const seedProducts = [
  { name: 'Apple', price: 0.99, category: 'fruit' },
  { name: 'Broccoli', price: 1.29, category: 'vegetable' },
  { name: 'Yogurt', price: 2.49, category: 'dairy' },
  { name: 'Spinach', price: 0.89, category: 'vegetable' },
  { name: 'Coconut', price: 2.99, category: 'fruit' },
  { name: 'Kale', price: 1.49, category: 'vegetable' },
  { name: 'Milk', price: 3.49, category: 'dairy' },
  { name: 'Cheese', price: 4.99, category: 'dairy' },
  { name: 'Banana', price: 0.99, category: 'fruit' },
];
// Product.deleteMany({}).then((res) => {
//     console.log('Products deleted successfully!');
//     console.log(res);
// }).catch((err) => {
//     console.log('Error deleting products:');
//     console.log(err);
// });
//
Product.insertMany(seedProducts).then((res) => {
    console.log('Products inserted successfully!');
    console.log(res);
}).catch((err) => {
    console.log('Error inserting products:');
    console.log(err);
});
