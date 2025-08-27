/**
 * Portfolio Server - Extended version with Socket.IO, MongoDB, and Redis
 */
require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
// Optional database connections - will work without them
let redisClient = null;
try {
  const { connectMongoDB, connectRedis } = require('./config/database');
  // Try to connect to databases but don't fail if they're not available
  connectMongoDB().catch(err => {
    console.log('MongoDB not available, continuing without it');
    // Don't exit process on MongoDB connection failure
  });
  try {
    redisClient = connectRedis();
  } catch (redisError) {
    console.log('Redis not available, continuing without it');
  }
} catch (error) {
  console.log('Database modules not available, running in standalone mode');
}

const socketHandlers = require('./socket/socketHandlers');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS configuration
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// Use body-parser middleware instead of express.json for older Express versions
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Make database connections available to routes
app.locals.redisClient = redisClient;

// Portfolio API Routes
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/particles', require('./routes/particles'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/github', require('./routes/github'));
app.use('/api/ai', require('./routes/ai'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    services: {
      mongodb: 'optional',
      redis: redisClient && redisClient.isOpen ? 'connected' : 'not available'
    }
  });
});

// Initialize Socket.IO handlers
socketHandlers(io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Portfolio server running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready for connections`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

module.exports = { app, server, io };