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

// ========== TEMPORARY SEED ROUTE ==========
app.get('/api/seed-now', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const User = require('./models/User');
    const Base = require('./models/Base');
    const Equipment = require('./models/Equipment');

    await User.deleteMany({});
    await Base.deleteMany({});
    await Equipment.deleteMany({});

    const bases = await Base.insertMany([
      { name: 'Northern Command', location: 'Jammu', code: 'NC' },
      { name: 'Southern Command', location: 'Pune', code: 'SC' },
      { name: 'Eastern Command', location: 'Kolkata', code: 'EC' },
      { name: 'Western Command', location: 'Chandimandir', code: 'WC' }
    ]);

    await Equipment.insertMany([
      { name: 'AK-47 Rifle', type: 'weapon', unit: 'pieces' },
      { name: 'T-90 Tank', type: 'vehicle', unit: 'units' },
      { name: '5.56mm Ammunition', type: 'ammunition', unit: 'rounds' },
      { name: 'Bofors Gun', type: 'other', unit: 'units' }
    ]);

      await User.create([
        { name: 'System Admin', email: 'admin@military.gov', password: 'admin123', role: 'admin' },
        { name: 'Base Commander', email: 'commander.nc@military.gov', password: 'admin123', role: 'base_commander', assignedBase: bases[0]._id },
        { name: 'Logistics Officer', email: 'logistics@military.gov', password: 'admin123', role: 'logistics_officer' }
          ]);

    res.json({
      success: true,
      message: 'Database seeded successfully',
      credentials: {
        admin: 'admin@military.gov / admin123',
        commander: 'commander.nc@military.gov / admin123',
        logistics: 'logistics@military.gov / admin123'
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ========== END ==========
// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
