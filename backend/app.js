const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to EFGD Monitoring Dashboard API' });
});

// Import routes
const authRoutes = require('./routes/auth');
const progressRoutes = require('./routes/progress');
const dashboardRoutes = require('./routes/dashboard');

// Use routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/progress', progressRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Set port and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 