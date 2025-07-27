/**
 * Farm Routes Module
 * Handles all farm-related HTTP requests and database operations
 * 
 * @author Farm Fresh Market Team
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const Farm = require('../models/farm');
const Product = require('../models/product');

// Categories for products (from Product model enum)
const categories = ['fruit', 'vegetable', 'dairy'];

/**
 * GET /farms
 * Display all farms in the system
 * 
 * @route GET /farms
 * @returns {Object} Rendered farms index page with all farms
 * @throws {500} Server error if database query fails
 */
router.get("/", async (req, res) => {
  try {
    const farms = await Farm.find({});
    console.log("Farms fetched successfully:", farms.length);
    res.render("farms/index", { farms });
  } catch (err) {
    console.error("Error fetching farms:", err);
    res.status(500).send("Error fetching farms");
  }
});

/**
 * GET /farms/new
 * Display form for creating a new farm
 * 
 * @route GET /farms/new
 * @returns {Object} Rendered new farm form page
 */
router.get("/new", (req, res) => {
  res.render("farms/new");
});

/**
 * POST /farms
 * Create a new farm in the database
 * 
 * @route POST /farms
 * @param {Object} req.body - Farm data from form submission
 * @param {string} req.body.name - Farm name
 * @param {string} req.body.type - Farm type
 * @param {string} req.body.location - Farm location
 * @param {string} req.body.email - Farm contact email
 * @returns {Redirect} Redirects to the newly created farm's detail page
 * @throws {500} Server error if farm creation fails
 */
router.post("/", async (req, res) => {
  try {
    const newFarm = new Farm(req.body);
    await newFarm.save();
    console.log("New farm created:", newFarm.name);
    res.redirect(`/farms/${newFarm._id}`);
  } catch (err) {
    console.error("Error creating farm:", err);
    res.status(500).send("Error creating farm");
  }
});

/**
 * GET /farms/:id
 * Display detailed information about a specific farm
 * 
 * @route GET /farms/:id
 * @param {string} req.params.id - Farm ID
 * @returns {Object} Rendered farm detail page with populated products
 * @throws {404} Farm not found
 * @throws {500} Server error if database query fails
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const farm = await Farm.findById(id).populate('products');
    
    if (!farm) {
      return res.status(404).send("Farm not found");
    }
    
    res.render("farms/show", { farm });
  } catch (err) {
    console.error("Error fetching farm:", err);
    res.status(500).send("Error fetching farm");
  }
});

/**
 * DELETE /farms/:id
 * Delete a farm and all its associated products
 * 
 * @route DELETE /farms/:id
 * @param {string} req.params.id - Farm ID to delete
 * @returns {Redirect} Redirects to farms listing page
 * @throws {404} Farm not found
 * @throws {500} Server error if deletion fails
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the farm to get associated products
    const farm = await Farm.findById(id);
    if (!farm) {
      return res.status(404).send("Farm not found");
    }
    
    // Delete all products associated with this farm
    const deletedProducts = await Product.deleteMany({ farm: id });
    console.log(`Deleted ${deletedProducts.deletedCount} products for farm: ${farm.name}`);
    
    // Delete the farm
    await Farm.findByIdAndDelete(id);
    console.log("Farm deleted:", farm.name);
    
    res.redirect("/farms");
  } catch (err) {
    console.error("Error deleting farm:", err);
    res.status(500).send("Error deleting farm");
  }
});

/**
 * GET /farms/:id/products
 * Display all products for a specific farm
 * 
 * @route GET /farms/:id/products
 * @param {string} req.params.id - Farm ID
 * @returns {Object} Rendered farm products page
 * @throws {404} Farm not found
 * @throws {500} Server error if database query fails
 */
router.get("/:id/products", async (req, res) => {
  try {
    const { id } = req.params;
    const farm = await Farm.findById(id).populate('products');
    
    if (!farm) {
      return res.status(404).send("Farm not found");
    }
    
    res.render("farms/products", { farm, products: farm.products });
  } catch (err) {
    console.error("Error fetching farm products:", err);
    res.status(500).send("Error fetching farm products");
  }
});

/**
 * GET /farms/:id/products/new
 * Display form for adding a new product to a specific farm
 * 
 * @route GET /farms/:id/products/new
 * @param {string} req.params.id - Farm ID
 * @returns {Object} Rendered new product form with farm context
 * @throws {500} Server error if form rendering fails
 */
router.get("/:id/products/new", (req, res) => {
  try {
    const { id } = req.params;
    res.render("products/new", { categories, farmId: id });
  } catch (e) {
    console.error("Error rendering new product form:", e.message);
    res.status(500).send("Error rendering new product form for farm");
  }
});

/**
 * POST /farms/:id/products
 * Create a new product and associate it with a specific farm
 * 
 * @route POST /farms/:id/products
 * @param {string} req.params.id - Farm ID
 * @param {Object} req.body - Product data from form submission
 * @param {string} req.body.name - Product name
 * @param {number} req.body.price - Product price
 * @param {string} req.body.category - Product category
 * @returns {Redirect} Redirects to farm detail page
 * @throws {404} Farm not found
 * @throws {500} Server error if product creation fails
 */
router.post("/:id/products", async (req, res) => {
  try {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    
    if (!farm) {
      return res.status(404).send("Farm not found");
    }
    
    // Create new product with farm association
    const newProduct = new Product(req.body);
    newProduct.farm = farm._id;
    await newProduct.save();
    
    // Add product to farm's products array
    farm.products.push(newProduct);
    await farm.save();
    
    console.log(`New product "${newProduct.name}" added to farm: ${farm.name}`);
    res.redirect(`/farms/${id}`);
  } catch (e) {
    console.error("Error creating product for farm:", e.message);
    res.status(500).send("Error creating product for farm");
  }
});

/**
 * DELETE /farms/:id/products/:productId
 * Delete a specific product from a farm
 * 
 * @route DELETE /farms/:id/products/:productId
 * @param {string} req.params.id - Farm ID
 * @param {string} req.params.productId - Product ID to delete
 * @returns {Redirect} Redirects to farm products page
 * @throws {404} Product not found
 * @throws {500} Server error if deletion fails
 */
router.delete("/:id/products/:productId", async (req, res) => {
  try {
    const { id, productId } = req.params;
    
    // Find and delete the product
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).send("Product not found");
    }
    
    // Remove product from farm's products array
    await Farm.findByIdAndUpdate(id, {
      $pull: { products: productId }
    });
    
    console.log(`Product "${deletedProduct.name}" deleted from farm`);
    res.redirect(`/farms/${id}/products`);
  } catch (err) {
    console.error("Error deleting product from farm:", err);
    res.status(500).send("Error deleting product");
  }
});

module.exports = router;