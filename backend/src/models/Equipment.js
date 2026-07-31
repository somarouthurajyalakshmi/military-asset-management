const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['vehicle', 'weapon', 'ammunition', 'other'],
    required: true
  },
  unit: {
    type: String,
    default: 'units'
  },
  description: String
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);
