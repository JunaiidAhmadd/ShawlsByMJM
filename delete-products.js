const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Define Product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  category: { type: String, required: true },
  tags: [String],
  colors: [String],
  sizes: [String],
  stockQuantity: { type: Number, required: true, default: 0 },
  sku: { type: String },
  brand: { type: String },
  status: { type: String, default: 'Active' },
  isFeatured: { type: Boolean, default: false },
  image: { type: String, default: '/img/product/no-image.jpg' },
  createdAt: { type: Date, default: Date.now }
});

// Create Product model
const Product = mongoose.model('Product', productSchema);

// Function to delete all products
async function deleteAllProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Count products before deletion
    const productCount = await Product.countDocuments();
    console.log(`Found ${productCount} products in the database`);
    
    // Delete all products
    const result = await Product.deleteMany({});
    console.log(`Deleted ${result.deletedCount} products successfully`);
    
    // Close connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error deleting products:', error);
  }
}

// Run the function
deleteAllProducts();