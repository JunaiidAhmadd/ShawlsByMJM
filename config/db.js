const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use environment variable or fallback to a default URI
    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://demo:demo@cluster0.mongodb.net/malefashion?retryWrites=true&w=majority';
    
    // Log what connection string is being used (without sensitive info)
    console.log(`Attempting to connect to MongoDB with ${mongoURI.split('@')[0]}...`);
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 