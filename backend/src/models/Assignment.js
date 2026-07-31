const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  base: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Base',
    required: true
  },
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  assignedTo: {
    type: String,
    required: true,
    trim: true
  },
  assignmentDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['assigned', 'expended', 'returned'],
    default: 'assigned'
  },
  expendedQuantity: {
    type: Number,
    default: 0
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
