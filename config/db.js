const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGO_URI is defined
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI environment variable is not defined.');
      console.error('Please set MONGO_URI in your environment variables or .env file.');
      return false;
    }
    
    // Use environment variable or fallback to a default URI
    const mongoURI = process.env.MONGO_URI;
    
    // Log what connection string is being used (without sensitive info)
    console.log(`Attempting to connect to MongoDB with ${mongoURI.split('@')[0]}...`);
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    return false;
  }
};

module.exports = connectDB; 