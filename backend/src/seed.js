require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Base = require('./models/Base');
const Equipment = require('./models/Equipment');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/military_assets');
    console.log('Connected to DB');

    // Clear existing
    await User.deleteMany();
    await Base.deleteMany();
    await Equipment.deleteMany();

    // Create Bases
    const base1 = await Base.create({ name: 'Northern Command', location: 'Jammu', code: 'NC01' });
    const base2 = await Base.create({ name: 'Southern Command', location: 'Pune', code: 'SC01' });
    const base3 = await Base.create({ name: 'Eastern Command', location: 'Kolkata', code: 'EC01' });

    // Create Equipment
    const eq1 = await Equipment.create({ name: 'AK-47 Rifle', type: 'weapon', unit: 'pieces' });
    const eq2 = await Equipment.create({ name: 'T-90 Tank', type: 'vehicle', unit: 'units' });
    const eq3 = await Equipment.create({ name: '5.56mm Ammunition', type: 'ammunition', unit: 'boxes' });
    const eq4 = await Equipment.create({ name: 'Jeep', type: 'vehicle', unit: 'units' });

    // Create Users
    // Admin
    await User.create({
      name: 'System Admin',
      email: 'admin@military.gov',
      password: 'admin123',
      role: 'admin'
    });

    // Base Commander - Northern
    await User.create({
      name: 'Col. Rajesh Kumar',
      email: 'commander.nc@military.gov',
      password: 'commander123',
      role: 'base_commander',
      assignedBase: base1._id
    });

    // Logistics Officer
    await User.create({
      name: 'Lt. Priya Sharma',
      email: 'logistics@military.gov',
      password: 'logistics123',
      role: 'logistics_officer'
    });

    console.log('Seed data created successfully!');
    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('Admin: admin@military.gov / admin123');
    console.log('Base Commander: commander.nc@military.gov / commander123');
    console.log('Logistics Officer: logistics@military.gov / logistics123');
    console.log('=========================\n');

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
