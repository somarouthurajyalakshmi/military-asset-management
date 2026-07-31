const express = require('express');
const router = express.Router();
const Transfer = require('../models/Transfer');
const { protect, authorize } = require('../middleware/auth');
const { logAction } = require('../middleware/logger');

router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'base_commander' && req.user.assignedBase) {
      query.$or = [
        { fromBase: req.user.assignedBase },
        { toBase: req.user.assignedBase }
      ];
    }
    if (req.query.fromBase) query.fromBase = req.query.fromBase;
    if (req.query.toBase) query.toBase = req.query.toBase;

    const transfers = await Transfer.find(query)
      .populate('fromBase', 'name code')
      .populate('toBase', 'name code')
      .populate('equipment', 'name type')
      .populate('recordedBy', 'name')
      .sort({ transferDate: -1 });

    res.json(transfers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('admin', 'logistics_officer', 'base_commander'), async (req, res) => {
  try {
    req.body.recordedBy = req.user._id;
    const transfer = await Transfer.create(req.body);
    await logAction(req, 'CREATE', 'Transfer', transfer._id, req.body);

    const populated = await Transfer.findById(transfer._id)
      .populate('fromBase', 'name code')
      .populate('toBase', 'name code')
      .populate('equipment', 'name type')
      .populate('recordedBy', 'name');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
