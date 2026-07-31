const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
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
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);
