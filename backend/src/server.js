require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const baseRoutes = require('./routes/bases');
const equipmentRoutes = require('./routes/equipment');
const purchaseRoutes = require('./routes/purchases');
const transferRoutes = require('./routes/transfers');
const assignmentRoutes = require('./routes/assignments');
const dashboardRoutes = require('./routes/dashboard');
const logRoutes = require('./routes/logs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect DB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bases', baseRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/logs', logRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Military Asset Management API is running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
