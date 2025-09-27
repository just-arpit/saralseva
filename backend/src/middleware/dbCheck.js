import mongoose from 'mongoose';

// Middleware to check if database is connected
export const checkDBConnection = (req, res, next) => {
  // Check if mongoose is connected
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database not connected. Please ensure MongoDB Atlas IP whitelist is configured.',
      error: 'SERVICE_UNAVAILABLE',
      instructions: {
        step1: 'Go to https://cloud.mongodb.com/',
        step2: 'Navigate to Network Access → IP Access List',
        step3: 'Add your IP address or allow all IPs (0.0.0.0/0) for development',
        currentIP: 'Run "curl -s https://ipinfo.io/ip" to get your current IP'
      }
    });
  }
  next();
};

// Optional middleware - warn but don't block if DB is down
export const warnDBConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    console.log(`⚠️  API ${req.method} ${req.path} called without database connection`);
    // Add a header to indicate DB is not available
    res.set('X-Database-Status', 'disconnected');
  }
  next();
};