const express = require('express');
const path = require('path');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const User = require('../models/User');
const multer = require('multer');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { isAdmin, isAuthenticated } = require('../middleware/auth');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'public/uploads/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueFileName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueFileName);
  }
});

// Initialize multer with storage options
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)) {
      console.log('File rejected - not an image:', file.originalname);
      // Don't throw error, just reject the file silently
      return cb(null, false);
    }
    console.log('File accepted:', file.originalname);
    cb(null, true);
  }
}).single('mainImage');

// Error handling middleware for multer
const uploadErrorHandler = (req, res, next) => {
  return function(err, req, res, next) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      console.error('Multer error:', err);
      return res.render('admin/add-product', {
        title: 'Add Product',
        formData: req.body,
        error: `Upload error: ${err.message}`
      });
    } else if (err) {
      // An unknown error occurred
      console.error('Upload error:', err);
      return res.render('admin/add-product', {
        title: 'Add Product',
        formData: req.body,
        error: `Error: ${err.message}`
      });
    }
    // No error occurred, continue with the next middleware
    next();
  };
};

// Home page route
router.get('/', async (req, res) => {
  try {
    // Get featured products for homepage
    const featuredProducts = await Product.find({ isFeatured: true }).limit(8);
    // Get categories for display
    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1 }).limit(3);
    
    res.render('index', { 
      title: 'Home',
      featuredProducts,
      categories 
    });
  } catch (error) {
    console.error('Error loading homepage:', error);
    res.render('index', { 
      title: 'Home',
      featuredProducts: [],
      categories: [],
      error: 'Error loading data'
    });
  }
});

// Shop page route
router.get('/shop', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    
    const category = req.query.category;
    const search = req.query.search;
    const sort = req.query.sort || 'newest';
    
    let filter = { status: 'Active' };
    
    // Apply category filter if provided
    if (category) {
      filter.category = category;
    }
    
    // Apply search filter if provided
    if (search) {
      filter.$text = { $search: search };
    }
    
    // Set up sorting
    let sortOptions = {};
    switch (sort) {
      case 'price-low':
        sortOptions.price = 1;
        break;
      case 'price-high':
        sortOptions.price = -1;
        break;
      case 'newest':
        sortOptions.createdAt = -1;
        break;
      case 'name-asc':
        sortOptions.name = 1;
        break;
      default:
        sortOptions.createdAt = -1;
    }
    
    // Get products
    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    
    // Debug: Log product names
    console.log('Found products:', products.length);
    products.forEach((product, index) => {
      console.log(`Product ${index + 1}: Name='${product.name || "NO NAME"}', ID=${product._id}`);
    });
    
    // Get total count for pagination
    const total = await Product.countDocuments(filter);
    
    // Get all categories for the filter sidebar
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    
    res.render('shop', { 
      title: 'Shop',
      products,
      categories,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
      search: search || '',
      currentCategory: category || '',
      currentSort: sort
    });
  } catch (error) {
    console.error('Error loading shop page:', error);
    res.render('shop', { 
      title: 'Shop',
      products: [],
      categories: [],
      error: 'Error loading products'
    });
  }
});

// Shop details page route
router.get('/shop-details/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.redirect('/shop');
    }
    
    // Get related products from the same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: productId },
      status: 'Active'
    }).limit(4);
    
    res.render('shop-details', { 
      title: product.name,
      product,
      relatedProducts
    });
  } catch (error) {
    console.error('Error loading product details:', error);
    res.redirect('/shop');
  }
});

// Redirect old shop-details route to use product ID
router.get('/shop-details', (req, res) => {
  res.redirect('/shop');
});

// Shopping cart page route
router.get('/shopping-cart', (req, res) => {
  // In a real application, you would retrieve the cart from session or database
  res.render('shopping-cart', { title: 'Shopping Cart', cart: [] });
});

// Checkout page route
router.get('/checkout', (req, res) => {
  // In a real application, you would retrieve the cart from session or database
  res.render('checkout', { title: 'Checkout', cart: [] });
});

// Process checkout (create order)
router.post('/checkout', async (req, res) => {
  try {
    // In a real application, you would validate user authentication here
    
    const { 
      shippingAddress, 
      city, 
      postalCode, 
      country, 
      paymentMethod,
      orderItems,
      totalPrice,
      taxPrice,
      shippingPrice
    } = req.body;
    
    // Create new order (this would normally use authenticated user's ID)
    const order = new Order({
      user: req.session.userId || '6500000000000000000000', // Placeholder - would use real user ID in production
      orderItems: JSON.parse(orderItems),
      shippingAddress: {
        address: shippingAddress,
        city,
        postalCode,
        country
      },
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice
    });
    
    const savedOrder = await order.save();
    
    // Redirect to order confirmation page with the order ID
    res.redirect(`/thank-you?orderId=${savedOrder._id}`);
  } catch (error) {
    console.error('Error processing checkout:', error);
    res.redirect('/checkout?error=Failed to process your order');
  }
});

// Thank you page route
router.get('/thank-you', (req, res) => {
  const orderId = req.query.orderId;
  res.render('thank-you', { 
    title: 'Order Confirmation',
    orderId
  });
});

// About page route
router.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

// Blog page route
router.get('/blog', (req, res) => {
  res.render('blog', { title: 'Blog' });
});

// Blog details page route
router.get('/blog-details', (req, res) => {
  res.render('blog-details', { title: 'Blog Details' });
});

// Contact page route
router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact' });
});

// Login page
router.get('/login', (req, res) => {
  // If already logged in, redirect to home
  if (req.session && req.session.isLoggedIn) {
    // If admin, redirect to admin dashboard
    if (req.session.user && req.session.user.isAdmin) {
      return res.redirect('/admin');
    }
    return res.redirect('/');
  }
  
  res.render('login', { 
    title: 'Login',
    error: req.query.error || null,
    message: req.query.message || null,
    successMessage: req.query.success || null
  });
});

// Login form submission
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);
    
    // Validate inputs
    if (!email || !password) {
      console.log('Missing email or password');
      return res.redirect('/login?error=Email and password are required');
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');
    
    // Check if user exists
    if (!user) {
      console.log('User not found');
      return res.redirect('/login?error=Invalid email or password');
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    console.log('User isAdmin:', user.isAdmin);
    
    if (!isMatch) {
      console.log('Password does not match');
      return res.redirect('/login?error=Invalid email or password');
    }
    
    // Set user session
    req.session.isLoggedIn = true;
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: Boolean(user.isAdmin) // Ensure this is a boolean
    };
    
    console.log('Session set:', req.session);
    console.log('Is admin flag in session:', req.session.user.isAdmin);
    
    // Force session save before redirect
    req.session.save(err => {
      if (err) {
        console.error('Session save error:', err);
        return res.redirect('/login?error=Session error');
      }
      
      // Redirect to appropriate page
      if (req.session.user.isAdmin) {
        console.log('Redirecting to admin dashboard');
        return res.redirect('/admin');
      }
      console.log('Redirecting to home page');
      return res.redirect('/');
    });
  } catch (error) {
    console.error('Login error:', error);
    res.redirect('/login?error=An error occurred during login');
  }
});

// Signup page
router.get('/signup', (req, res) => {
  // If already logged in, redirect to home
  if (req.session && req.session.isLoggedIn) {
    return res.redirect('/');
  }
  
  res.render('signup', { 
    title: 'Sign Up',
    error: req.query.error || null
  });
});

// Signup form submission
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    
    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
      return res.redirect('/signup?error=All fields are required');
    }
    
    if (password !== confirmPassword) {
      return res.redirect('/signup?error=Passwords do not match');
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.redirect('/signup?error=Email is already registered');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: false  // Default to non-admin
    });
    
    await user.save();
    
    // Redirect to login with success message
    res.redirect('/login?success=Account created successfully. Please log in.');
  } catch (error) {
    console.error('Signup error:', error);
    res.redirect('/signup?error=An error occurred during signup');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) console.error('Session destruction error:', err);
    res.redirect('/login');
  });
});

// Admin routes
// Admin dashboard
router.get('/admin', isAdmin, async (req, res) => {
  res.redirect('/admin/analytics');
});

// Admin analytics page
router.get('/admin/analytics', isAdmin, async (req, res) => {
  try {
    // Get sales statistics
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    
    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name');
    
    // Get stats for charts
    const monthlyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    const categorySales = await Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          totalSold: { $sum: '$orderItems.qty' }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $group: {
          _id: '$productDetails.category',
          totalSold: { $sum: '$totalSold' }
        }
      }
    ]);
    
    res.render('admin/analytics', { 
      title: 'Analytics',
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        revenue: await Order.aggregate([
          { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]).then(result => result.length > 0 ? result[0].total : 0)
      },
      recentOrders,
      monthlyOrders,
      categorySales,
      body: '',
      script: `
        <script>
          // Charts would be initialized here with data from the backend
          // This script would create sales charts, category distribution, etc.
        </script>
      `
    });
  } catch (error) {
    console.error('Error loading analytics:', error);
    res.render('admin/analytics', { 
      title: 'Analytics',
      stats: { totalProducts: 0, totalOrders: 0, totalUsers: 0, revenue: 0 },
      recentOrders: [],
      monthlyOrders: [],
      categorySales: [],
      error: 'Error loading analytics data',
      body: '',
      script: ''
    });
  }
});

// Admin products list page
router.get('/admin/products', isAdmin, async (req, res) => {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const search = req.query.search || '';
    const category = req.query.category || '';
    const status = req.query.status || '';
    const sort = req.query.sort || 'newest';
    
    // Build filter
    let filter = {};
    if (search) {
      filter.$text = { $search: search };
    }
    if (category) {
      filter.category = category;
    }
    if (status) {
      filter.status = status;
    }
    
    // Build sort options
    let sortOptions = {};
    switch (sort) {
      case 'price-low':
        sortOptions.price = 1;
        break;
      case 'price-high':
        sortOptions.price = -1;
        break;
      case 'name-asc':
        sortOptions.name = 1;
        break;
      case 'name-desc':
        sortOptions.name = -1;
        break;
      case 'newest':
        sortOptions.createdAt = -1;
        break;
      case 'oldest':
        sortOptions.createdAt = 1;
        break;
      default:
        sortOptions.createdAt = -1;
    }
    
    // Get products
    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Product.countDocuments(filter);
    
    // Get categories for filter dropdown
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    
    res.render('admin/products', { 
      title: 'Products',
      products,
      categories,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
      filters: { search, category, status, sort },
      success: req.query.success
    });
  } catch (error) {
    console.error('Error loading admin products page:', error);
    res.render('admin/products', { 
      title: 'Products',
      products: [],
      categories: [],
      error: 'Error loading products'
    });
  }
});

// Admin add product page
router.get('/admin/products/add', isAdmin, async (req, res) => {
  try {
    // Get categories for the dropdown
    res.render('admin/add-product', { 
      title: 'Add Product',
      formData: {},
      error: null
    });
  } catch (error) {
    console.error('Error loading add product page:', error);
    res.status(500).render('error', { message: 'Error loading add product page' });
  }
});

// Handle add product form submission
router.post('/admin/products/add', isAdmin, (req, res, next) => {
  upload(req, res, function(err) {
    if (err) {
      console.error('File upload error:', err);
      return res.render('admin/add-product', {
        title: 'Add Product',
        formData: req.body,
        error: `File upload error: ${err.message}`
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    console.log('Add product request received:', req.body);
    console.log('File upload:', req.file);
    
    // Extract the file path if an image was uploaded
    let imagePath = '/img/product/no-image.jpg'; // Default image
    if (req.file) {
      // Make path relative to public directory
      imagePath = '/uploads/' + req.file.filename;
      console.log('Image path set to:', imagePath);
    }
    
    const {
      name,
      description,
      category,
      price,
      salePrice,
      sku,
      stockQuantity,
      colors,
      sizes,
      tags,
      status,
      isFeatured
    } = req.body;
    
    // Validate required fields
    if (!name || !description || !price) {
      console.log('Validation failed. Missing required fields');
      return res.render('admin/add-product', {
        title: 'Add Product',
        formData: req.body,
        error: 'Please fill all required fields: Name, Description, and Price are required'
      });
    }
    
    // Process and sanitize the name (trim to remove whitespace)
    const processedName = name ? name.trim() : '';
    console.log('Processed product name:', processedName);
    
    // Normalize status field - First letter capitalized
    let normalizedStatus = 'Active'; // Default
    if (status) {
      // Capitalize first letter
      normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }
    
    // Create new product
    const product = new Product({
      name: processedName,
      description,
      category: category || 'Women Winter and Summer Shawls',
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      sku: sku || `SKU-${Date.now()}`,
      stockQuantity: stockQuantity ? Number(stockQuantity) : 0,
      colors: colors ? (Array.isArray(colors) ? colors : [colors]) : [],
      sizes: sizes ? (Array.isArray(sizes) ? sizes : [sizes]) : [],
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      status: normalizedStatus, // Use normalized status
      isFeatured: isFeatured === 'on' || isFeatured === true,
      image: imagePath,
      images: [imagePath], // Also store the image in the images array for consistency
      rating: 0,
      numReviews: 0
    });
    
    console.log('Saving product:', product);
    
    const savedProduct = await product.save();
    console.log('Product saved successfully with ID:', savedProduct._id);
    
    res.redirect('/admin/products?success=Product added successfully');
  } catch (error) {
    console.error('Error adding product:', error);
    
    res.render('admin/add-product', {
      title: 'Add Product',
      formData: req.body,
      error: `Error adding product: ${error.message}`
    });
  }
});

// Admin edit product page
router.get('/admin/products/edit/:id', isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.redirect('/admin/products');
    }
    
    // Get categories for the dropdown
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    
    res.render('admin/edit-product', { 
      title: 'Edit Product',
      product,
      categories,
      error: null
    });
  } catch (error) {
    console.error('Error loading edit product page:', error);
    res.redirect('/admin/products');
  }
});

// Handle edit product form submission
router.post('/admin/products/edit/:id', isAdmin, (req, res, next) => {
  upload(req, res, function(err) {
    if (err) {
      console.error('File upload error:', err);
      return res.redirect(`/admin/products/edit/${req.params.id}?error=${encodeURIComponent(`File upload error: ${err.message}`)}`);
    }
    next();
  });
}, async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Extract the file path if an image was uploaded
    let imagePath = null;
    if (req.file) {
      imagePath = '/uploads/' + req.file.filename;
    }
    
    const {
      name,
      description,
      category,
      price,
      salePrice,
      sku,
      stockQuantity,
      colors,
      sizes,
      tags,
      status,
      isFeatured
    } = req.body;
    
    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.redirect('/admin/products?error=Product not found');
    }
    
    // Process and sanitize the name (trim to remove whitespace)
    const processedName = name ? name.trim() : '';
    console.log('Processed product name for edit:', processedName);
    
    // Normalize status field - First letter capitalized
    let normalizedStatus = 'Active'; // Default
    if (status) {
      // Capitalize first letter
      normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }
    
    // Update fields
    product.name = processedName;
    product.description = description;
    product.category = category || 'Women Winter and Summer Shawls';
    product.price = price;
    product.salePrice = salePrice || 0;
    product.sku = sku;
    product.stockQuantity = stockQuantity || 0;
    product.colors = colors ? (typeof colors === 'string' ? [colors] : colors) : [];
    product.sizes = sizes ? (typeof sizes === 'string' ? [sizes] : sizes) : [];
    product.tags = tags ? tags.split(',').map(tag => tag.trim()) : [];
    product.status = normalizedStatus;
    product.isFeatured = isFeatured === 'on';
    
    // Update image only if a new one was uploaded
    if (imagePath) {
      // If the product already has images, replace the first one
      if (product.images && product.images.length > 0) {
        product.images[0] = imagePath;
      } else {
        product.images = [imagePath];
      }
    }
    
    await product.save();
    
    res.redirect('/admin/products?success=Product updated successfully');
  } catch (error) {
    console.error('Error updating product:', error);
    res.redirect(`/admin/products/edit/${req.params.id}?error=${error.message}`);
  }
});

// Admin delete product
router.get('/admin/products/delete/:id', isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin/products?success=Product deleted successfully');
  } catch (error) {
    console.error('Error deleting product:', error);
    res.redirect('/admin/products?error=Failed to delete product');
  }
});

// Delete product route
router.post('/admin/products/delete/:id', isAdmin, async (req, res) => {
    try {
        const productId = req.params.id;
        console.log('Attempting to delete product:', productId);

        // Find the product first to get the image path
        const product = await Product.findById(productId);
        if (!product) {
            console.log('Product not found:', productId);
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Delete the product image if it exists
        if (product.imagePath) {
            const imagePath = path.join(__dirname, '..', 'public', product.imagePath);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
                console.log('Deleted product image:', imagePath);
            }
        }

        // Delete the product from database
        const deletedProduct = await Product.findByIdAndDelete(productId);
        console.log('Product deleted successfully:', deletedProduct);

        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ success: false, message: 'Error deleting product' });
    }
});

// Health check route for monitoring
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Fallback route for any other pages
router.get('*', (req, res) => {
  res.render('index', { title: 'Home' });
});

module.exports = router; 