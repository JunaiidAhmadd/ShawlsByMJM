const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const session = require('express-session');
const flash = require('connect-flash');

// Load environment variables
dotenv.config();

// Set environment variables with fallbacks
const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 10000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'pakistani_shawls_default_secret';

// Show environment info
console.log(`Node environment: ${NODE_ENV}`);
console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);

// Connect to MongoDB
try {
  connectDB();
} catch (error) {
  console.error('Failed to connect to MongoDB:', error);
  // Continue running the app even if DB connection fails
}

// Initialize express app
const app = express();

// Middleware
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
  })
);

// Show warning if using memory store in production
if (NODE_ENV === 'production') {
  console.warn('Warning: connect.session() MemoryStore is not');
  console.warn('designed for a production environment, as it will leak');
  console.warn('memory, and will not scale past a single process.');
}

// Flash messages middleware
app.use(flash());

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  
  next();
});

// Import routes
const routes = require('./routes');

// Use routes
app.use('/', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    title: 'Error',
    message: NODE_ENV === 'development' ? err.message : 'Something went wrong!' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 