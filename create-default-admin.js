const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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

// Default admin credentials
const adminName = "Admin User";
const adminEmail = "admin@example.com";
const adminPassword = "admin123";

// Function to create default admin user
async function createDefaultAdmin() {
  try {
    console.log("==========================================");
    console.log("CREATING DEFAULT ADMIN USER");
    console.log("==========================================");
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Delete any existing user with the admin email (to ensure clean state)
    await User.deleteOne({ email: adminEmail });
    console.log(`Removed any existing user with email: ${adminEmail}`);
    
    // Hash the admin password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    // Create the admin user
    const adminUser = new User({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      isAdmin: true
    });
    
    // Save admin user
    await adminUser.save();
    
    console.log("==========================================");
    console.log("DEFAULT ADMIN CREATED SUCCESSFULLY!");
    console.log("==========================================");
    console.log("LOGIN CREDENTIALS:");
    console.log(`Name: ${adminName}`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log("==========================================");
    console.log("PLEASE USE THESE CREDENTIALS EXACTLY AS SHOWN");
    console.log("==========================================");
    
    // Close connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Run the function
createDefaultAdmin(); 