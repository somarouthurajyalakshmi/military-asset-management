const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const { protect, authorize } = require('../middleware/auth');
const { logAction } = require('../middleware/logger');

router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'base_commander' && req.user.assignedBase) {
      query.base = req.user.assignedBase;
    }
    const assignments = await Assignment.find(query)
      .populate('base', 'name code')
      .populate('equipment', 'name type')
      .populate('recordedBy', 'name')
      .sort({ assignmentDate: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('admin', 'base_commander'), async (req, res) => {
  try {
    if (req.user.role === 'base_commander' && req.user.assignedBase) {
      req.body.base = req.user.assignedBase;
    }
    req.body.recordedBy = req.user._id;
    const assignment = await Assignment.create(req.body);
    await logAction(req, 'CREATE', 'Assignment', assignment._id, req.body);
    const populated = await Assignment.findById(assignment._id)
      .populate('base', 'name code')
      .populate('equipment', 'name type')
      .populate('recordedBy', 'name');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark as expended
router.put('/:id/expend', protect, authorize('admin', 'base_commander'), async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    const expendQty = req.body.quantity || assignment.quantity;
    assignment.expendedQuantity += expendQty;
    if (assignment.expendedQuantity >= assignment.quantity) {
      assignment.status = 'expended';
    }
    await assignment.save();
    await logAction(req, 'EXPEND', 'Assignment', assignment._id, { quantity: expendQty });
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
