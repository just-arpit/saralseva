import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // First, try to connect to MongoDB Atlas
    console.log('🔄 Attempting to connect to MongoDB Atlas...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // Increased timeout
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      bufferCommands: false,
    });

    console.log(`📊 MongoDB Connected Successfully: ${conn.connection.host}`);
    console.log(`📁 Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔒 MongoDB connection closed through app termination');
      process.exit(0);
    });

    return conn;

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.log('');
      console.log('🔐 IP WHITELIST ISSUE DETECTED:');
      console.log('   Your IP address needs to be added to MongoDB Atlas whitelist.');
      console.log('   Current IP: Run "curl -s https://ipinfo.io/ip" to get your IP');
      console.log('   Then add it to: https://cloud.mongodb.com/ → Network Access → IP Whitelist');
      console.log('');
    }
    
    console.log('⚠️  Continuing without database connection. Some features may not work.');
    console.log('🚀 Server will still start for testing frontend functionality.');
    
    // Don't exit the process, continue running the server
    return null;
  }
};