require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const connectDB = require('./src/config/db');
const { errorHandler, notFound } = require('./src/middleware/error');

// Routes
const authRoutes = require('./src/routes/auth');
const ngoRoutes = require('./src/routes/ngo');
const schemeRoutes = require('./src/routes/schemes');
const projectRoutes = require('./src/routes/projects');
const chatRoutes = require('./src/routes/chat');
const documentRoutes = require('./src/routes/documents');
const analyticsRoutes = require('./src/routes/analytics');
const adminRoutes = require('./src/routes/admin');

const app = express();

// Connect to DB
connectDB();

// Security Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use('/api', limiter);

// Auth rate limiter
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
app.use('/api/auth', authLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Static files (uploaded documents)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'SevaAI Backend is running!', timestamp: new Date(), version: '1.0.0' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ngo', ngoRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);

// 404 & Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 SevaAI Backend running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => { server.close(() => process.exit(0)); });
process.on('unhandledRejection', (err) => { console.error('Unhandled Promise Rejection:', err); server.close(() => process.exit(1)); });

module.exports = app;
