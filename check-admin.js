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

// Function to check admin user
async function checkAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Find admin user
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    
    if (adminUser) {
      console.log('Admin user found:');
      console.log('Name:', adminUser.name);
      console.log('Email:', adminUser.email);
      console.log('isAdmin:', adminUser.isAdmin);
      console.log('Password hash exists:', !!adminUser.password);
    } else {
      console.log('Admin user not found!');
    }
    
    // Close connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error checking admin user:', error);
  }
}

// Run the function
checkAdminUser(); 