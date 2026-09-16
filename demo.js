// Seed only an empty database. Never run automatically during deployment.
const mongoose = require('mongoose');
const Farm = require('./models/farm');
const Product = require('./models/product');
if (!process.env.VERCEL) require('dotenv').config();

const demoFarms = [
  {
    name: "Sunny Valley Organic Farm",
    type: "Mixed",
    location: "Napa Valley, CA",
    email: "info@sunnyvalley.example"
  },
  {
    name: "Green Meadows Dairy",
    type: "Dairy",
    location: "Vermont Hills, VT",
    email: "contact@greenmeadows.example"
  },
  {
    name: "Fresh Harvest Orchards",
    type: "Fruit",
    location: "Washington State, WA",
    email: "hello@freshharvest.example"
  },
  {
    name: "Mountain View Vegetables",
    type: "Vegetable",
    location: "Colorado Springs, CO",
    email: "orders@mountainview.example"
  }
];

/**
 * Demo data for products
 */
const demoProducts = [
  // Sunny Valley Organic Farm products
  { name: "Organic Tomatoes", price: 4.99, category: "vegetable" },
  { name: "Fresh Strawberries", price: 6.99, category: "fruit" },
  { name: "Artisan Cheese", price: 12.99, category: "dairy" },
  
  // Green Meadows Dairy products
  { name: "Whole Milk", price: 3.99, category: "dairy" },
  { name: "Greek Yogurt", price: 5.99, category: "dairy" },
  { name: "Butter", price: 4.49, category: "dairy" },
  
  // Fresh Harvest Orchards products
  { name: "Honeycrisp Apples", price: 3.99, category: "fruit" },
  { name: "Organic Pears", price: 4.99, category: "fruit" },
  { name: "Fresh Peaches", price: 5.99, category: "fruit" },
  
  // Mountain View Vegetables products
  { name: "Organic Carrots", price: 2.99, category: "vegetable" },
  { name: "Fresh Spinach", price: 3.99, category: "vegetable" },
  { name: "Bell Peppers", price: 4.99, category: "vegetable" }
];

async function runDemo() {
  if (!process.env.MONGODB_URI) throw new Error('Set MONGODB_URI to the intended market database.');
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    if (await Farm.exists({}) || await Product.exists({})) {
      throw new Error('Seed stopped: database already contains farms or products. No data was changed.');
    }
    for (let i = 0; i < demoFarms.length; i++) {
      const farm = await Farm.create(demoFarms[i]);
      const products = await Product.insertMany(demoProducts.slice(i * 3, i * 3 + 3)
        .map(product => ({ ...product, farm: farm._id })));
      farm.products = products.map(product => product._id);
      await farm.save();
    }
    console.log('Created four fictional farms and twelve sample products.');
  } finally {
    await mongoose.disconnect();
  }
}
if (require.main === module) runDemo().catch(() => {
  console.error('Seed stopped. Verify configuration and that the database is empty. Existing data is never cleared.');
  process.exitCode = 1;
});
module.exports = { runDemo };
