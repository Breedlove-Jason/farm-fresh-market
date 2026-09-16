/**
 * Product Routes Module
 * Handles all product-related HTTP requests and database operations
 * 
 * @author Farm Fresh Market Team
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const pick = body => Object.fromEntries(["name", "price", "category"].filter(key => Object.hasOwn(body, key)).map(key => [key, body[key]]));
const Product = require('../models/product');
const Farm = require('../models/farm');

/**
 * GET /products
 * Display all products in the system
 * 
 * @route GET /products
 * @returns {Object} Rendered products index page with all products
 * @throws {500} Server error if database query fails
 */
router.get("/", async (req, res, next) => {
  try {
    const products = await Product.find({}).populate('farm');
    console.log("Products fetched successfully:", products.length);
    res.render("products/index", { products });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /products/new
 * Display form for creating a new standalone product
 * 
 * @route GET /products/new
 * @returns {Object} Rendered new product form page
 */
router.get("/new", (req, res, next) => {
  res.render("products/new", { farmId: null });
});

/**
 * POST /products
 * Create a new standalone product in the database
 * 
 * @route POST /products
 * @param {Object} req.body - Product data from form submission
 * @param {string} req.body.name - Product name
 * @param {number} req.body.price - Product price
 * @param {string} req.body.category - Product category (fruit, vegetable, dairy)
 * @returns {Redirect} Redirects to the newly created product's detail page
 * @throws {500} Server error if product creation fails
 */
router.post("/", async (req, res, next) => {
  try {
    const newProduct = new Product(Object.fromEntries(['name', 'price', 'category'].filter(key => Object.hasOwn(req.body, key)).map(key => [key, req.body[key]])));
    await newProduct.save();
    console.log("New standalone product created:", newProduct.name);
    res.redirect(`/products/${newProduct._id}`);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /products/:id
 * Display detailed information about a specific product
 * 
 * @route GET /products/:id
 * @param {string} req.params.id - Product ID
 * @returns {Object} Rendered product detail page with farm information
 * @throws {404} Product not found
 * @throws {500} Server error if database query fails
 */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('farm');
    
    if (!product) {
      return res.status(404).send("Product not found");
    }
    
    res.render("products/show", { product });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /products/:id/edit
 * Display form for editing an existing product
 * 
 * @route GET /products/:id/edit
 * @param {string} req.params.id - Product ID to edit
 * @returns {Object} Rendered product edit form with current product data
 * @throws {404} Product not found
 * @throws {500} Server error if database query fails
 */
router.get("/:id/edit", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).send("Product not found");
    }
    
    res.render("products/edit", { product });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /products/:id
 * Update an existing product with new data
 * 
 * @route PUT /products/:id
 * @param {string} req.params.id - Product ID to update
 * @param {Object} req.body - Updated product data
 * @param {string} req.body.name - Updated product name
 * @param {number} req.body.price - Updated product price
 * @param {string} req.body.category - Updated product category
 * @returns {Redirect} Redirects to the updated product's detail page
 * @throws {404} Product not found
 * @throws {500} Server error if update fails
 */
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, { $set: pick(req.body) }, {
      runValidators: true,
      new: true,
    });
    
    if (!product) {
      return res.status(404).send("Product not found");
    }
    
    console.log("Product updated:", product.name);
    res.redirect(`/products/${product._id}`);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /products/:id
 * Delete a product from the database and remove from associated farm
 * 
 * @route DELETE /products/:id
 * @param {string} req.params.id - Product ID to delete
 * @returns {Redirect} Redirects to products listing page
 * @throws {404} Product not found
 * @throws {500} Server error if deletion fails
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Find the product to get farm association
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    
    // If product is associated with a farm, remove it from farm's products array
    if (product.farm) {
      await Farm.findByIdAndUpdate(product.farm, {
        $pull: { products: id }
      });
      console.log(`Product "${product.name}" removed from farm association`);
    }
    
    // Delete the product
    await Product.findByIdAndDelete(id);
    console.log("Product deleted:", product.name);
    
    res.redirect("/products");
  } catch (err) {
    next(err);
  }
});

module.exports = router;