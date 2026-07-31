const express = require('express');
const router = express.Router();
const Base = require('../models/Base');
const { protect, authorize } = require('../middleware/auth');
const { logAction } = require('../middleware/logger');

router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'base_commander' && req.user.assignedBase) {
      query._id = req.user.assignedBase;
    }
    const bases = await Base.find(query);
    res.json(bases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const base = await Base.create(req.body);
    await logAction(req, 'CREATE', 'Base', base._id, req.body);
    res.status(201).json(base);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
