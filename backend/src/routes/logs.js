const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const logs = await Log.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
