// Load environment variables first
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from './src/routes/auth.js';
import userRoutes from './src/routes/user.js';
import schemeRoutes from './src/routes/scheme.js';
import eventRoutes from './src/routes/event.js';
import complaintRoutes from './src/routes/complaint.js';
import documentRoutes from './src/routes/document.js';
import locationRoutes from './src/routes/location.js';
import notificationRoutes from './src/routes/notification.js';
import dashboardRoutes from './src/routes/dashboard.js';
import chatbotRoutes from './src/routes/chatbot.js';
import taxRoutes from './src/routes/tax.js';
import qaRoutes from './src/routes/qa.js';

// Import middleware
import { errorHandler } from './src/middleware/errorHandler.js';
import { notFound } from './src/middleware/notFound.js';

// Import config
import { connectDB } from './src/config/database.js';
import { swaggerSpec, swaggerUi } from './src/config/swagger.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:3000',
    'https://saral-seva-frontend.onrender.com',
    process.env.FRONTEND_URL || 'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}));

// Apply rate limiting to all requests
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/tax', taxRoutes);
app.use('/api/qa', qaRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Saral Seva Pro API',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health'
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Saral Seva Backend running on port ${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
});

export default app;