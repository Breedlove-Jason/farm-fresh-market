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
if (!process.env.VERCEL) require("dotenv").config();

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

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Global middleware
app.use(requestLogger);
app.use(securityHeaders);
app.use(express.static(path.join(__dirname, "public")));
app.disable("x-powered-by");
app.locals.serialize = value => JSON.stringify(value).replace(/</g, "\\u003c");
app.use(express.urlencoded({ extended: false, limit: "16kb" }));
app.use(methodOverride("_method"));
app.use(require("./utils/access"));

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
app.get("/api/stats", checkDatabaseConnection, async (req, res) => {
  try {
    const [farmCount, productCount] = await Promise.all([Farm.countDocuments(), Product.countDocuments()]);
    
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
app.use("/farms", checkDatabaseConnection, farmRoutes);
app.use("/products", checkDatabaseConnection, productRoutes);

// 404 handler for undefined routes
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

// Vercel imports the app; local development starts a listener.
module.exports = app;
if (require.main === module && !process.env.VERCEL) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Farm Fresh Market listening on ${port}`));
}
