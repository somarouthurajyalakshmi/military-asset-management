const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  entity: {
    type: String,
    required: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  details: {
    type: Object
  },
  ip: String
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);
