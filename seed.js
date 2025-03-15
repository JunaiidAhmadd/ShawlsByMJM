const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Sample categories
const categories = [
  {
    name: 'Pashmina Shawls',
    slug: 'pashmina-shawls',
    description: 'Luxurious pashmina shawls crafted from the finest cashmere wool.',
    image: '/img/categories/category-1.jpg',
    isActive: true,
    displayOrder: 1,
    metaTitle: 'Premium Pashmina Shawls - Pakistani Handcrafted Excellence',
    metaDescription: 'Discover our collection of authentic Pakistani pashmina shawls, handcrafted with premium cashmere wool for unmatched elegance and warmth.'
  },
  {
    name: 'Embroidered Shawls',
    slug: 'embroidered-shawls',
    description: 'Intricately embroidered shawls featuring traditional Pakistani designs.',
    image: '/img/categories/category-2.jpg',
    isActive: true,
    displayOrder: 2,
    metaTitle: 'Embroidered Pakistani Shawls - Traditional Craftsmanship',
    metaDescription: 'Explore our collection of hand-embroidered Pakistani shawls with intricate designs passed down through generations of skilled artisans.'
  },
  {
    name: 'Printed Shawls',
    slug: 'printed-shawls',
    description: 'Vivid printed shawls with contemporary and traditional Pakistani patterns.',
    image: '/img/categories/category-3.jpg',
    isActive: true,
    displayOrder: 3,
    metaTitle: 'Printed Pakistani Shawls - Modern Designs with Traditional Touch',
    metaDescription: 'Browse our collection of printed Pakistani shawls featuring vibrant colors and both modern and traditional patterns.'
  },
  {
    name: 'Wedding Shawls',
    slug: 'wedding-shawls',
    description: 'Exquisite wedding shawls for special occasions with luxurious embellishments.',
    image: '/img/categories/category-4.jpg',
    isActive: true,
    displayOrder: 4,
    metaTitle: 'Pakistani Wedding Shawls - Luxury Ceremonial Collection',
    metaDescription: 'Find the perfect wedding shawl from our luxury collection of Pakistani ceremonial shawls with gold thread work and intricate embellishments.'
  },
  {
    name: 'Wool Shawls',
    slug: 'wool-shawls',
    description: 'Warm and comfortable wool shawls for everyday wear and winter seasons.',
    image: '/img/categories/category-5.jpg',
    isActive: true,
    displayOrder: 5,
    metaTitle: 'Pakistani Wool Shawls - Warmth and Style Combined',
    metaDescription: 'Stay warm with our collection of authentic Pakistani wool shawls, offering both comfort and style for everyday wear.'
  }
];

// Sample products
const products = [
  {
    name: 'Royal Blue Pashmina Shawl',
    description: 'Luxurious royal blue pashmina shawl crafted from 100% cashmere wool. Features a soft texture and provides exceptional warmth. Perfect for formal events or cold weather.',
    price: 129.99,
    salePrice: 99.99,
    category: 'Pashmina Shawls',
    images: ['/img/product/product-1.jpg', '/img/product/product-1-1.jpg', '/img/product/product-1-2.jpg'],
    colors: ['Royal Blue', 'Navy Blue', 'Teal'],
    sizes: ['Standard'],
    countInStock: 25,
    rating: 4.8,
    numReviews: 12,
    isFeatured: true,
    status: 'Active',
    sku: 'PSH-BLU-1001',
    tags: ['pashmina', 'blue', 'cashmere', 'winter', 'premium']
  },
  {
    name: 'Hand Embroidered Red Wedding Shawl',
    description: 'Exquisite hand-embroidered wedding shawl in rich red color. Features gold and silver thread work with traditional Pakistani motifs. Perfect for bridal wear and special occasions.',
    price: 299.99,
    salePrice: 249.99,
    category: 'Wedding Shawls',
    images: ['/img/product/product-2.jpg', '/img/product/product-2-1.jpg', '/img/product/product-2-2.jpg'],
    colors: ['Red', 'Maroon'],
    sizes: ['Standard'],
    countInStock: 10,
    rating: 5.0,
    numReviews: 8,
    isFeatured: true,
    status: 'Active',
    sku: 'WED-RED-2001',
    tags: ['wedding', 'embroidered', 'bridal', 'luxury', 'red']
  },
  {
    name: 'Black Wool Blend Winter Shawl',
    description: 'Warm and comfortable black wool blend shawl perfect for winter. Features a classic design with subtle texture. Ideal for everyday wear during cold months.',
    price: 79.99,
    salePrice: 0,
    category: 'Wool Shawls',
    images: ['/img/product/product-3.jpg', '/img/product/product-3-1.jpg', '/img/product/product-3-2.jpg'],
    colors: ['Black', 'Charcoal'],
    sizes: ['Standard'],
    countInStock: 40,
    rating: 4.5,
    numReviews: 15,
    isFeatured: false,
    status: 'Active',
    sku: 'WOL-BLK-3001',
    tags: ['wool', 'black', 'winter', 'casual', 'everyday']
  },
  {
    name: 'Floral Printed Summer Shawl',
    description: 'Lightweight summer shawl with vibrant floral prints. Made from a cotton blend that is perfect for warm weather. Adds a pop of color to any outfit.',
    price: 59.99,
    salePrice: 39.99,
    category: 'Printed Shawls',
    images: ['/img/product/product-4.jpg', '/img/product/product-4-1.jpg', '/img/product/product-4-2.jpg'],
    colors: ['Multicolor', 'Pink', 'Blue'],
    sizes: ['Standard'],
    countInStock: 30,
    rating: 4.2,
    numReviews: 9,
    isFeatured: true,
    status: 'Active',
    sku: 'PRT-FLR-4001',
    tags: ['printed', 'floral', 'summer', 'lightweight', 'colorful']
  },
  {
    name: 'Emerald Green Embroidered Shawl',
    description: 'Stunning emerald green shawl with intricate embroidery. Features traditional Pakistani designs with modern color palette. Perfect for special occasions.',
    price: 149.99,
    salePrice: 0,
    category: 'Embroidered Shawls',
    images: ['/img/product/product-5.jpg', '/img/product/product-5-1.jpg', '/img/product/product-5-2.jpg'],
    colors: ['Emerald Green', 'Forest Green'],
    sizes: ['Standard'],
    countInStock: 15,
    rating: 4.7,
    numReviews: 11,
    isFeatured: true,
    status: 'Active',
    sku: 'EMB-GRN-5001',
    tags: ['embroidered', 'green', 'special occasion', 'traditional', 'formal']
  },
  {
    name: 'Beige Pashmina Wrap Shawl',
    description: 'Elegant beige pashmina wrap shawl with versatile styling options. Made from premium cashmere for superior softness and warmth. A timeless addition to any wardrobe.',
    price: 119.99,
    salePrice: 89.99,
    category: 'Pashmina Shawls',
    images: ['/img/product/product-6.jpg', '/img/product/product-6-1.jpg', '/img/product/product-6-2.jpg'],
    colors: ['Beige', 'Cream', 'Taupe'],
    sizes: ['Standard'],
    countInStock: 20,
    rating: 4.6,
    numReviews: 14,
    isFeatured: false,
    status: 'Active',
    sku: 'PSH-BGE-6001',
    tags: ['pashmina', 'beige', 'neutral', 'wrap', 'versatile']
  },
  {
    name: 'Burgundy Wedding Collection Shawl',
    description: 'Luxurious burgundy shawl from our wedding collection. Features elaborate zari work and sequin embellishments. Perfect for the bride or wedding guests.',
    price: 279.99,
    salePrice: 0,
    category: 'Wedding Shawls',
    images: ['/img/product/product-7.jpg', '/img/product/product-7-1.jpg', '/img/product/product-7-2.jpg'],
    colors: ['Burgundy', 'Wine Red'],
    sizes: ['Standard'],
    countInStock: 8,
    rating: 4.9,
    numReviews: 7,
    isFeatured: true,
    status: 'Active',
    sku: 'WED-BUR-7001',
    tags: ['wedding', 'burgundy', 'embellished', 'zari work', 'bridal']
  },
  {
    name: 'Gray Herringbone Wool Shawl',
    description: 'Classic gray herringbone wool shawl with timeless pattern. Made from high-quality wool that provides excellent insulation. Perfect for professional settings.',
    price: 89.99,
    salePrice: 69.99,
    category: 'Wool Shawls',
    images: ['/img/product/product-8.jpg', '/img/product/product-8-1.jpg', '/img/product/product-8-2.jpg'],
    colors: ['Gray', 'Light Gray'],
    sizes: ['Standard'],
    countInStock: 35,
    rating: 4.4,
    numReviews: 13,
    isFeatured: false,
    status: 'Active',
    sku: 'WOL-GRY-8001',
    tags: ['wool', 'gray', 'herringbone', 'professional', 'classic']
  }
];

// Create admin user
const admin = {
  name: 'Admin User',
  email: 'admin@pakistanishawls.com',
  password: 'password123',
  isAdmin: true,
  phone: '+92 300 1234567',
  address: {
    street: '123 Main Street',
    city: 'Lahore',
    state: 'Punjab',
    postalCode: '54000',
    country: 'Pakistan'
  }
};

// Import data function
const importData = async () => {
  try {
    // Clear existing data
    await Category.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data cleared...');
    
    // Create admin user
    const createdAdmin = await User.create(admin);
    console.log('Admin user created...');
    
    // Add user reference to products
    const productsWithUser = products.map(product => {
      return { ...product, user: createdAdmin._id };
    });

    // Import categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`${createdCategories.length} categories created...`);
    
    // Import products
    const createdProducts = await Product.insertMany(productsWithUser);
    console.log(`${createdProducts.length} products created...`);

    console.log('Data imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Call the import function
importData(); 