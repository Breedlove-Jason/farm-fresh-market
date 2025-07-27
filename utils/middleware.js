/**
 * Middleware and Utility Functions
 * Common middleware functions and utilities used across the application
 * 
 * @author Farm Fresh Market Team
 * @version 1.0.0
 */

/**
 * Global error handling middleware
 * Catches and handles all unhandled errors in the application
 * 
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      error: 'Validation Error',
      details: errors
    });
  }
  
  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid ID format'
    });
  }
  
  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      error: `${field} already exists`
    });
  }
  
  // Default server error
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

/**
 * 404 Not Found middleware
 * Handles requests to non-existent routes
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const notFound = (req, res) => {
  res.status(404).render('404', {
    url: req.originalUrl,
    title: 'Page Not Found'
  });
};

/**
 * Request logging middleware
 * Logs all incoming requests with timestamp and method
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
};

/**
 * Security headers middleware
 * Adds basic security headers to all responses
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
};

/**
 * Database connection status checker
 * Middleware to check if database is connected before processing requests
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const checkDatabaseConnection = (req, res, next) => {
  const mongoose = require('mongoose');
  
  if (mongoose.connection.readyState !== 1) {
    console.error('Database not connected');
    return res.status(503).json({
      error: 'Service Unavailable',
      message: 'Database connection is not available'
    });
  }
  
  next();
};

/**
 * Async error wrapper
 * Wraps async route handlers to catch and forward errors
 * 
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Wrapped function with error handling
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Validation helper for MongoDB ObjectIds
 * 
 * @param {string} id - ID to validate
 * @returns {boolean} True if valid ObjectId, false otherwise
 */
const isValidObjectId = (id) => {
  const mongoose = require('mongoose');
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Sanitize user input
 * Basic input sanitization to prevent XSS
 * 
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Format price for display
 * 
 * @param {number} price - Price to format
 * @returns {string} Formatted price string
 */
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

/**
 * Generate pagination data
 * 
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} total - Total number of items
 * @returns {Object} Pagination data object
 */
const getPaginationData = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;
  
  return {
    currentPage: page,
    totalPages,
    hasNext,
    hasPrev,
    nextPage: hasNext ? page + 1 : null,
    prevPage: hasPrev ? page - 1 : null,
    limit,
    total
  };
};

module.exports = {
  errorHandler,
  notFound,
  requestLogger,
  securityHeaders,
  checkDatabaseConnection,
  asyncHandler,
  isValidObjectId,
  sanitizeInput,
  formatPrice,
  getPaginationData
};