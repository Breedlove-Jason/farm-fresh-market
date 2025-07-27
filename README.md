# 🌱 Farm Fresh Market

A modern web application connecting local farms with fresh food lovers. Built with Node.js, Express, MongoDB Atlas, and EJS templating.
![screenshot.png](screenshot.png)
## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Routes](#routes)
- [Technologies Used](#technologies-used)
- [Docker Deployment](#docker-deployment)
- [Contributing](#contributing)

## ✨ Features

### 🏠 **Main Homepage**
- Professional landing page with animated statistics
- Navigation to all major sections
- Real-time farm and product counts
- Responsive design with Bootstrap 5

### 🚜 **Farm Management**
- View all partner farms
- Add new farms to the network
- Detailed farm profiles with contact information
- Farm-specific product management
- Search and filter functionality

### 🥕 **Product Management**
- Browse all available products
- Add products to specific farms
- Product categorization (fruits, vegetables, dairy)
- Edit and delete products
- Price management

### 🔗 **Farm-Product Integration**
- Products are linked to specific farms
- Farm-specific product listings
- Cascading delete operations
- Relationship management

## 📁 Project Structure

```
farm-fresh-market/
├── models/                 # Database models
│   ├── farm.js            # Farm schema and model
│   └── product.js         # Product schema and model
├── routes/                # Route modules
│   ├── farms.js           # Farm-related routes
│   └── products.js        # Product-related routes
├── utils/                 # Utilities and middleware
│   └── middleware.js      # Common middleware functions
├── views/                 # EJS templates
│   ├── index.ejs          # Homepage template
│   ├── farms/             # Farm-related views
│   │   ├── index.ejs      # All farms listing
│   │   ├── show.ejs       # Farm details
│   │   ├── new.ejs        # New farm form
│   │   └── products.ejs   # Farm-specific products
│   └── products/          # Product-related views
│       ├── index.ejs      # All products listing
│       ├── show.ejs       # Product details
│       ├── new.ejs        # New product form
│       └── edit.ejs       # Edit product form
├── public/                # Static assets
│   ├── css/               # Stylesheets
│   └── js/                # Client-side JavaScript
├── package.json           # Project dependencies and scripts
├── index.js               # Main application server
├── demo.js                # Database seeding and demo script
├── .env                   # Environment variables (not in repo)
└── README.md              # This file
```

## 🚀 Installation

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB Atlas Account** (for cloud database)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Breedlove-Jason/farm-fresh-market.git
   cd farm-fresh-market
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory with your MongoDB Atlas credentials:
   ```env
   MONGODB_PASSWORD=your_mongodb_password
   MONGODB_USERNAME=your_mongodb_username
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/farm-fresh-market?retryWrites=true&w=majority&appName=farmFreshMarket
   PORT=3000
   NODE_ENV=development
   ```

4. **Seed the database with demo data**
   ```bash
   npm run demo
   # or
   node demo.js
   ```

5. **Start the application**
   ```bash
   npm start
   # or
   node index.js
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage

### Getting Started

1. **Homepage**: Visit the main page to see application overview and statistics
2. **Browse Farms**: Click "Explore Farms" to see all partner farms
3. **Browse Products**: Click "Browse Products" to see all available products
4. **Add a Farm**: Use "Add New Farm" to join the network
5. **Add Products**: Navigate to a farm and use "Add Product" to list items

### Farm Management

- **View All Farms**: `/farms`
- **Add New Farm**: `/farms/new`
- **Farm Details**: `/farms/:id`
- **Farm Products**: `/farms/:id/products`
- **Add Product to Farm**: `/farms/:id/products/new`

### Product Management

- **View All Products**: `/products`
- **Add New Product**: `/products/new`
- **Product Details**: `/products/:id`
- **Edit Product**: `/products/:id/edit`

## 📚 API Documentation

### Statistics API

#### GET `/api/stats`
Returns real-time application statistics.

**Response:**
```json
{
  "farmCount": 12,
  "productCount": 48,
  "timestamp": "2024-01-27T15:11:00.000Z"
}
```

### Farm Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/farms` | List all farms |
| GET | `/farms/new` | New farm form |
| POST | `/farms` | Create new farm |
| GET | `/farms/:id` | Farm details |
| DELETE | `/farms/:id` | Delete farm |
| GET | `/farms/:id/products` | Farm products |
| GET | `/farms/:id/products/new` | New product form for farm |
| POST | `/farms/:id/products` | Add product to farm |
| DELETE | `/farms/:id/products/:productId` | Remove product from farm |

### Product Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | List all products |
| GET | `/products/new` | New product form |
| POST | `/products` | Create new product |
| GET | `/products/:id` | Product details |
| GET | `/products/:id/edit` | Edit product form |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |

## 🗄️ Database Schema

### Farm Model

```javascript
{
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  products: [{
    type: ObjectId,
    ref: "Product"
  }]
}
```

### Product Model

```javascript
{
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    enum: ['fruit', 'vegetable', 'dairy'],
    lowercase: true
  },
  farm: {
    type: ObjectId,
    ref: 'Farm'
  }
}
```

## 🛣️ Routes

### Application Routes

- **Homepage**: `/` - Main landing page
- **Statistics API**: `/api/stats` - Real-time statistics

### Farm Routes (`/farms`)

- **Index**: `/` - All farms listing
- **New**: `/new` - Create farm form
- **Show**: `/:id` - Farm details
- **Create**: `/` (POST) - Create new farm
- **Delete**: `/:id` (DELETE) - Delete farm
- **Products**: `/:id/products` - Farm products
- **New Product**: `/:id/products/new` - Add product form
- **Create Product**: `/:id/products` (POST) - Add product
- **Delete Product**: `/:id/products/:productId` (DELETE) - Remove product

### Product Routes (`/products`)

- **Index**: `/` - All products listing
- **New**: `/new` - Create product form
- **Show**: `/:id` - Product details
- **Edit**: `/:id/edit` - Edit product form
- **Create**: `/` (POST) - Create new product
- **Update**: `/:id` (PUT) - Update product
- **Delete**: `/:id` (DELETE) - Delete product

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **EJS** - Templating engine
- **Method-Override** - HTTP method override
- **dotenv** - Environment variable management

### Frontend
- **Bootstrap 5** - CSS framework (Lux theme)
- **Font Awesome** - Icons
- **Vanilla JavaScript** - Client-side interactions

### Development Tools
- **JSDoc** - Code documentation
- **npm** - Package management

## 🔧 Configuration

### Environment Variables

The application requires a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=3000
MONGODB_PASSWORD=your_mongodb_password
MONGODB_USERNAME=your_mongodb_username
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/farm-fresh-market?retryWrites=true&w=majority&appName=farmFreshMarket
```

### Database Configuration

The application connects to MongoDB Atlas using the cloud connection string. The database includes:
- **Database**: `farm-fresh-market`
- **Collections**: `farms`, `products`
- **Connection**: MongoDB Atlas (cloud-hosted)

## 🧪 Testing

### Demo Data

Run the comprehensive demo script to populate the database and test functionality:

```bash
npm run demo
```

This script will:
- Connect to MongoDB Atlas
- Clear existing demo data
- Create 4 demo farms with different types
- Create 12 demo products across categories
- Display statistics and relationships
- Test database operations

### Manual Testing

1. **Start the application**
   ```bash
   npm start
   ```

2. **Test the homepage**
   - Visit `http://localhost:3000`
   - Verify statistics load correctly
   - Test navigation links

3. **Test farm functionality**
   - Create a new farm
   - View farm details
   - Add products to farm
   - Delete products and farms

4. **Test product functionality**
   - Create standalone products
   - Edit product details
   - Delete products

## 🐳 Docker Deployment

### Dockerfile

Create a `Dockerfile` in the project root:

```dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/stats || exit 1

# Start application
CMD ["node", "index.js"]
```

### Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  farm-fresh-market:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    env_file:
      - .env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/stats"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Build and Run

```bash
# Build the Docker image
docker build -t farm-fresh-market .

# Run with Docker Compose
docker-compose up -d

# Or run directly
docker run -d \
  --name farm-fresh-market \
  -p 3000:3000 \
  --env-file .env \
  farm-fresh-market
```

## 🚀 Production Deployment

### Environment Setup

1. **Set production environment variables**
   ```bash
   export NODE_ENV=production
   export PORT=3000
   ```

2. **Ensure MongoDB Atlas is configured**
   - Whitelist production server IP
   - Use production database
   - Enable authentication

3. **Install production dependencies**
   ```bash
   npm ci --only=production
   ```

4. **Seed production database**
   ```bash
   node demo.js
   ```

5. **Start the application**
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use JSDoc comments for all functions
- Follow Express.js best practices
- Maintain consistent error handling
- Write descriptive commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Farm Fresh Market Team** - *Initial work*

## 🙏 Acknowledgments

- Bootstrap team for the excellent CSS framework
- MongoDB team for the robust database platform
- Express.js community for the web framework
- All the local farms that inspire this project

## 📊 Project Status

✅ **Fully Functional Demo Application**
- MongoDB Atlas cloud database integration
- Comprehensive seed data with 4 farms and 12 products
- All CRUD operations working
- Docker deployment ready
- Production environment configured

The application is ready for deployment and demonstrates a complete farm-to-market platform with modern web technologies.