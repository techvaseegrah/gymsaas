const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// Debug environment variables
console.log('Environment variables:');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Loaded' : 'Not found');
console.log('PORT:', process.env.PORT || 5000);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Loaded' : 'Not found');

// Verify dotenv is working
console.log('Full process.env.PORT:', process.env.PORT);
console.log('Full process.env.MONGO_URI:', process.env.MONGO_URI);
console.log('Full process.env.JWT_SECRET:', process.env.JWT_SECRET);

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Initialize socket handler
const { initSocketHandler } = require('./socketHandler');
initSocketHandler(io);
app.set('io', io);

// Middleware
app.use(express.json({ limit: '50mb' })); 
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
};
connectDB();

// --- ROUTES ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/fighters', require('./routes/fighters'));
// Ensure you are using settingsRoutes.js (not settings.js if that was the duplicate)
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/doubts', require('./routes/doubts'));
app.use('/api/tenants', require('./routes/tenants'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/superadmin', require('./routes/superadmin'));

// NEW: Gym Stats Route
app.use('/api/gym-stats', require('./routes/gymStats'));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(500).json({ msg: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});