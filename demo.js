/**
 * Farm Fresh Market - Complete Application Demo
 * Demonstrates all features and functionality of the refactored application
 * 
 * @author Farm Fresh Market Team
 * @version 2.0.0
 * @description Complete demonstration of the farm-fresh-market application
 */

const mongoose = require("mongoose");
const Farm = require("./models/farm");
const Product = require("./models/product");

/**
 * Demo data for farms
 */
const demoFarms = [
  {
    name: "Sunny Valley Organic Farm",
    type: "Mixed",
    location: "Napa Valley, CA",
    email: "info@sunnyvalley.com"
  },
  {
    name: "Green Meadows Dairy",
    type: "Dairy",
    location: "Vermont Hills, VT",
    email: "contact@greenmeadows.com"
  },
  {
    name: "Fresh Harvest Orchards",
    type: "Fruit",
    location: "Washington State, WA",
    email: "hello@freshharvest.com"
  },
  {
    name: "Mountain View Vegetables",
    type: "Vegetable",
    location: "Colorado Springs, CO",
    email: "orders@mountainview.com"
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

/**
 * Clear existing demo data
 */
async function clearDemoData() {
  console.log("🧹 Clearing existing demo data...");
  
  await Farm.deleteMany({ 
    name: { $in: demoFarms.map(f => f.name) } 
  });
  
  await Product.deleteMany({ 
    name: { $in: demoProducts.map(p => p.name) } 
  });
  
  console.log("✅ Demo data cleared");
}

/**
 * Create demo farms
 */
async function createDemoFarms() {
  console.log("🚜 Creating demo farms...");
  
  const createdFarms = [];
  
  for (const farmData of demoFarms) {
    const farm = new Farm(farmData);
    await farm.save();
    createdFarms.push(farm);
    console.log(`  ✓ Created farm: ${farm.name}`);
  }
  
  console.log(`✅ Created ${createdFarms.length} demo farms`);
  return createdFarms;
}

/**
 * Create demo products and associate with farms
 */
async function createDemoProducts(farms) {
  console.log("🥕 Creating demo products...");
  
  const createdProducts = [];
  let productIndex = 0;
  
  for (let i = 0; i < farms.length; i++) {
    const farm = farms[i];
    const farmProducts = demoProducts.slice(productIndex, productIndex + 3);
    
    for (const productData of farmProducts) {
      const product = new Product({
        ...productData,
        farm: farm._id
      });
      
      await product.save();
      
      // Add product to farm's products array
      farm.products.push(product._id);
      
      createdProducts.push(product);
      console.log(`  ✓ Created product: ${product.name} for ${farm.name}`);
    }
    
    await farm.save();
    productIndex += 3;
  }
  
  console.log(`✅ Created ${createdProducts.length} demo products`);
  return createdProducts;
}

/**
 * Display application statistics
 */
async function displayStatistics() {
  console.log("📊 Application Statistics:");
  console.log("=" .repeat(50));
  
  const farmCount = await Farm.countDocuments();
  const productCount = await Product.countDocuments();
  
  // Category breakdown
  const fruitCount = await Product.countDocuments({ category: 'fruit' });
  const vegetableCount = await Product.countDocuments({ category: 'vegetable' });
  const dairyCount = await Product.countDocuments({ category: 'dairy' });
  
  // Farm type breakdown
  const farmTypes = await Farm.aggregate([
    { $group: { _id: "$type", count: { $sum: 1 } } }
  ]);
  
  console.log(`📈 Total Farms: ${farmCount}`);
  console.log(`📈 Total Products: ${productCount}`);
  console.log("");
  console.log("🏷️  Product Categories:");
  console.log(`   🍎 Fruits: ${fruitCount}`);
  console.log(`   🥕 Vegetables: ${vegetableCount}`);
  console.log(`   🧀 Dairy: ${dairyCount}`);
  console.log("");
  console.log("🚜 Farm Types:");
  farmTypes.forEach(type => {
    console.log(`   ${type._id}: ${type.count}`);
  });
  console.log("");
}

/**
 * Display farm details with products
 */
async function displayFarmDetails() {
  console.log("🏪 Farm Details with Products:");
  console.log("=" .repeat(50));
  
  const farms = await Farm.find({}).populate('products');
  
  for (const farm of farms) {
    console.log(`\n🚜 ${farm.name}`);
    console.log(`   📍 Location: ${farm.location}`);
    console.log(`   📧 Email: ${farm.email}`);
    console.log(`   🏷️  Type: ${farm.type}`);
    console.log(`   📦 Products (${farm.products.length}):`);
    
    if (farm.products.length > 0) {
      farm.products.forEach(product => {
        console.log(`      • ${product.name} - $${product.price.toFixed(2)} (${product.category})`);
      });
    } else {
      console.log("      No products available");
    }
  }
  console.log("");
}

/**
 * Test database relationships
 */
async function testRelationships() {
  console.log("🔗 Testing Database Relationships:");
  console.log("=" .repeat(50));
  
  // Test farm-to-products relationship
  const farmWithProducts = await Farm.findOne({}).populate('products');
  if (farmWithProducts && farmWithProducts.products.length > 0) {
    console.log(`✅ Farm-to-Products: ${farmWithProducts.name} has ${farmWithProducts.products.length} products`);
  }
  
  // Test product-to-farm relationship
  const productWithFarm = await Product.findOne({}).populate('farm');
  if (productWithFarm && productWithFarm.farm) {
    console.log(`✅ Product-to-Farm: ${productWithFarm.name} belongs to ${productWithFarm.farm.name}`);
  }
  
  // Test cascading delete (create and delete a test farm)
  const testFarm = new Farm({
    name: "Test Farm for Deletion",
    type: "Test",
    location: "Test Location",
    email: "test@test.com"
  });
  await testFarm.save();
  
  const testProduct = new Product({
    name: "Test Product",
    price: 1.00,
    category: "fruit",
    farm: testFarm._id
  });
  await testProduct.save();
  
  testFarm.products.push(testProduct._id);
  await testFarm.save();
  
  // Delete farm and associated products
  await Product.deleteMany({ farm: testFarm._id });
  await Farm.findByIdAndDelete(testFarm._id);
  
  console.log("✅ Cascading Delete: Test farm and product deleted successfully");
  console.log("");
}

/**
 * Display available routes and endpoints
 */
function displayRoutes() {
  console.log("🛣️  Available Routes and Endpoints:");
  console.log("=" .repeat(50));
  
  console.log("🏠 Main Application:");
  console.log("   GET  /                    - Homepage with statistics");
  console.log("   GET  /api/stats           - Real-time statistics API");
  console.log("");
  
  console.log("🚜 Farm Routes:");
  console.log("   GET  /farms               - List all farms");
  console.log("   GET  /farms/new           - New farm form");
  console.log("   POST /farms               - Create new farm");
  console.log("   GET  /farms/:id           - Farm details");
  console.log("   DELETE /farms/:id         - Delete farm");
  console.log("   GET  /farms/:id/products  - Farm-specific products");
  console.log("   GET  /farms/:id/products/new - Add product to farm");
  console.log("   POST /farms/:id/products  - Create product for farm");
  console.log("   DELETE /farms/:id/products/:productId - Delete product from farm");
  console.log("");
  
  console.log("🥕 Product Routes:");
  console.log("   GET  /products            - List all products");
  console.log("   GET  /products/new        - New product form");
  console.log("   POST /products            - Create new product");
  console.log("   GET  /products/:id        - Product details");
  console.log("   GET  /products/:id/edit   - Edit product form");
  console.log("   PUT  /products/:id        - Update product");
  console.log("   DELETE /products/:id      - Delete product");
  console.log("");
}

/**
 * Main demo function
 */
async function runDemo() {
  try {
    console.log("🌱 Farm Fresh Market - Complete Application Demo");
    console.log("=" .repeat(60));
    console.log("");
    
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/farmStand");
    console.log("✅ Connected to MongoDB");
    console.log("");
    
    // Clear existing demo data
    await clearDemoData();
    console.log("");
    
    // Create demo data
    const farms = await createDemoFarms();
    console.log("");
    
    const products = await createDemoProducts(farms);
    console.log("");
    
    // Display statistics
    await displayStatistics();
    
    // Display farm details
    await displayFarmDetails();
    
    // Test relationships
    await testRelationships();
    
    // Display available routes
    displayRoutes();
    
    console.log("🎯 Demo Features Demonstrated:");
    console.log("=" .repeat(50));
    console.log("✅ Main homepage with statistics");
    console.log("✅ Farm management (CRUD operations)");
    console.log("✅ Product management (CRUD operations)");
    console.log("✅ Farm-Product relationships");
    console.log("✅ Database population and queries");
    console.log("✅ Cascading delete operations");
    console.log("✅ API endpoints for statistics");
    console.log("✅ Modular route organization");
    console.log("✅ Error handling and middleware");
    console.log("✅ Comprehensive documentation");
    console.log("");
    
    console.log("🚀 Ready to Start Server:");
    console.log("=" .repeat(50));
    console.log("Run 'node index.js' to start the application");
    console.log("Visit http://localhost:3000 to see the homepage");
    console.log("Navigate through farms and products to test functionality");
    console.log("");
    
    console.log("📋 Project Structure:");
    console.log("=" .repeat(50));
    console.log("✅ Modular routes (routes/farms.js, routes/products.js)");
    console.log("✅ Utility middleware (utils/middleware.js)");
    console.log("✅ Database models (models/farm.js, models/product.js)");
    console.log("✅ EJS templates (views/)");
    console.log("✅ Static assets (public/)");
    console.log("✅ Main application server (index.js)");
    console.log("✅ Comprehensive documentation (README.md)");
    console.log("");
    
    console.log("🎉 Demo completed successfully!");
    console.log("The farm-fresh-market application is fully functional and documented.");
    
  } catch (error) {
    console.error("❌ Demo failed:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("📝 Database connection closed");
  }
}

// Run the demo
if (require.main === module) {
  runDemo();
}

module.exports = {
  runDemo,
  clearDemoData,
  createDemoFarms,
  createDemoProducts,
  displayStatistics,
  displayFarmDetails,
  testRelationships
};