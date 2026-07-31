const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');
const { protect, authorize } = require('../middleware/auth');
const { logAction } = require('../middleware/logger');

router.get('/', protect, async (req, res) => {
  try {
    const equipment = await Equipment.find();
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const equipment = await Equipment.create(req.body);
    await logAction(req, 'CREATE', 'Equipment', equipment._id, req.body);
    res.status(201).json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
