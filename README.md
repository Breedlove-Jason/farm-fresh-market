# 🌱 Farm Fresh Market

A modern web application connecting local farms with fresh food lovers. Built with Node.js, Express, MongoDB, and EJS templating.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Routes](#routes)
- [Technologies Used](#technologies-used)
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
├── index.js               # Main application server
├── seeds.js               # Database seeding script
└── README.md              # This file
```

## 🚀 Installation

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone 
   cd farm-fresh-market
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start MongoDB**
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Ubuntu/Debian
   sudo systemctl start mongod
   
   # Or run directly
   mongod
   ```

4. **Seed the database (optional)**
   ```bash
   node seeds.js
   ```

5. **Start the application**
   ```bash
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
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **EJS** - Templating engine
- **Method-Override** - HTTP method override

### Frontend
- **Bootstrap 5** - CSS framework (Lux theme)
- **Font Awesome** - Icons
- **Vanilla JavaScript** - Client-side interactions

### Development Tools
- **JSDoc** - Code documentation
- **ESLint** - Code linting (recommended)
- **Nodemon** - Development server (recommended)

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/farmStand
```

### Database Configuration

The application connects to MongoDB using the following default settings:
- **Database**: `farmStand`
- **Host**: `localhost`
- **Port**: `27017`

## 🧪 Testing

### Manual Testing

1. **Start the application**
   ```bash
   node index.js
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

### Test Script

Run the included test script to verify functionality:

```bash
node test_complete_implementation.js
```

## 🚀 Deployment

### Production Setup

1. **Set environment variables**
   ```bash
   export NODE_ENV=production
   export PORT=80
   export MONGODB_URI=mongodb://your-production-db
   ```

2. **Install production dependencies**
   ```bash
   npm install --production
   ```

3. **Start the application**
   ```bash
   node index.js
   ```

### Docker Deployment (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
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
- MongoDB team for the robust database
- Express.js community for the web framework
- All the local farms that inspire this project

## 📞 Support

For support, email hello@farmfresh.com or create an issue in the repository.

---

**Built with ❤️ for local communities**