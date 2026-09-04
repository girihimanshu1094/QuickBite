const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// for backend testing
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Quickbite API is running"
  });
});

// Base API route
app.get('/api', (req, res) => {
  res.json({
    name: 'QuickBite API',
    tagline: 'Skip the Queue. Enjoy Your Food.',
    status: 'Running',
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/canteens', require('./routes/canteenRoutes'));
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/pickup-slots', require('./routes/pickupSlotRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));

// Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`QuickBite Server running on port ${PORT}`);
  });
}

module.exports = app;
