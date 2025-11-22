const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Import socket handler
const { initSocketHandler } = require('./socketHandler');

// Initialize socket handler
initSocketHandler(io);

// Make io available to routes
app.set('io', io);

// Middleware
app.use(express.json({ limit: '10mb' })); // Increase limit for Base64 images
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Import Models
const Admin = require('./models/Admin');
const Settings = require('./models/SettingsModel');
const Tenant = require('./models/Tenant');

// Database Connection with error handling
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/gym_management';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');

    // Note: Settings are now tenant-specific and will be created per-tenant
    // when needed via the settings routes

  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.log('Please ensure MongoDB is running on your system');
    // Don't exit the process, allow server to run without DB for now
  }
};

connectDB();

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/fighters', require('./routes/fighters'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/doubts', require('./routes/doubts'));
app.use('/api/tenants', require('./routes/tenants'));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(500).json({ msg: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`JWT_SECRET configured: ${!!process.env.JWT_SECRET}`);
});