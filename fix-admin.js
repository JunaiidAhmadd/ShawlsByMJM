const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Define User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
});

// Create User model
const User = mongoose.model('User', userSchema);

// Function to create admin user
async function fixAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Find admin user
    let adminUser = await User.findOne({ email: 'admin@example.com' });
    
    if (adminUser) {
      console.log('Admin user found:');
      console.log('Name:', adminUser.name);
      console.log('Email:', adminUser.email);
      console.log('isAdmin before update:', adminUser.isAdmin);
      
      // Make sure isAdmin is true
      adminUser.isAdmin = true;
      await adminUser.save();
      
      console.log('isAdmin after update:', adminUser.isAdmin);
      console.log('Admin user updated successfully');
    } else {
      console.log('Admin user not found. Creating new admin...');
      
      // Create admin user with bcrypt
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      adminUser = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        isAdmin: true
      });
      
      await adminUser.save();
      console.log('Admin user created successfully');
    }
    
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error fixing admin user:', error);
  }
}

// Run the function
fixAdminUser(); 