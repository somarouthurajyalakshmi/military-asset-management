const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const { protect, authorize } = require('../middleware/auth');
const { logAction } = require('../middleware/logger');

router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'base_commander' && req.user.assignedBase) {
      query.base = req.user.assignedBase;
    }
    if (req.query.base) query.base = req.query.base;
    if (req.query.equipment) query.equipment = req.query.equipment;
    if (req.query.startDate || req.query.endDate) {
      query.purchaseDate = {};
      if (req.query.startDate) query.purchaseDate.$gte = new Date(req.query.startDate);
      if (req.query.endDate) query.purchaseDate.$lte = new Date(req.query.endDate);
    }

    const purchases = await Purchase.find(query)
      .populate('base', 'name code')
      .populate('equipment', 'name type')
      .populate('recordedBy', 'name')
      .sort({ purchaseDate: -1 });

    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('admin', 'logistics_officer', 'base_commander'), async (req, res) => {
  try {
    // Base commander can only purchase for their own base
    if (req.user.role === 'base_commander' && req.user.assignedBase) {
      req.body.base = req.user.assignedBase;
    }
    req.body.recordedBy = req.user._id;

    const purchase = await Purchase.create(req.body);
    await logAction(req, 'CREATE', 'Purchase', purchase._id, req.body);

    const populated = await Purchase.findById(purchase._id)
      .populate('base', 'name code')
      .populate('equipment', 'name type')
      .populate('recordedBy', 'name');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
