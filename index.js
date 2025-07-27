/**
 * Farm Fresh Market - Main Application Server
 * A marketplace connecting local farms with fresh food lovers
 * 
 * @author Farm Fresh Market Team
 * @version 2.0.0
 * @description Refactored application with modular routes and improved error handling
 */

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
require("dotenv").config();

// Import route modules
const farmRoutes = require("./routes/farms");
const productRoutes = require("./routes/products");

// Import middleware and utilities
const {
  errorHandler,
  notFound,
  requestLogger,
  securityHeaders,
  checkDatabaseConnection
} = require("./utils/middleware");

// Import models for statistics
const Product = require("./models/product");
const Farm = require("./models/farm");

const app = express();

// Database connection with improved error handling
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Global middleware
app.use(requestLogger);
app.use(securityHeaders);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(checkDatabaseConnection);

/**
 * Homepage route - serves the main landing page
 * Connects all pieces of the farm-fresh-market app together
 */
app.get("/", (req, res) => {
  res.render("index");
});

/**
 * API endpoint for real-time statistics
 * Returns current counts of farms and products
 */
app.get("/api/stats", async (req, res) => {
  try {
    const farmCount = await Farm.countDocuments();
    const productCount = await Product.countDocuments();
    
    res.json({
      farmCount,
      productCount,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

// Route modules
app.use("/farms", farmRoutes);
app.use("/products", productRoutes);

// 404 handler for undefined routes
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

// Server startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
