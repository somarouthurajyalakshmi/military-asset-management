const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const Transfer = require('../models/Transfer');
const Assignment = require('../models/Assignment');
const { protect } = require('../middleware/auth');

router.get('/metrics', protect, async (req, res) => {
  try {
    const { base, equipment, startDate, endDate } = req.query;
    
    let baseFilter = null;

    if (req.user.role === 'base_commander' && req.user.assignedBase) {
      baseFilter = req.user.assignedBase;
    } else if (base) {
      baseFilter = base;
    }

    // Purchases
    let purchaseQuery = {};
    if (baseFilter) purchaseQuery.base = baseFilter;
    if (equipment) purchaseQuery.equipment = equipment;
    if (startDate || endDate) {
      purchaseQuery.purchaseDate = {};
      if (startDate) purchaseQuery.purchaseDate.$gte = new Date(startDate);
      if (endDate) purchaseQuery.purchaseDate.$lte = new Date(endDate);
    }
    const purchases = await Purchase.find(purchaseQuery);
    const totalPurchases = purchases.reduce((sum, p) => sum + p.quantity, 0);

    // Transfers In
    let transferInQuery = {};
    if (baseFilter) transferInQuery.toBase = baseFilter;
    if (equipment) transferInQuery.equipment = equipment;
    if (startDate || endDate) {
      transferInQuery.transferDate = {};
      if (startDate) transferInQuery.transferDate.$gte = new Date(startDate);
      if (endDate) transferInQuery.transferDate.$lte = new Date(endDate);
    }
    const transfersIn = await Transfer.find(transferInQuery);
    const totalTransferIn = transfersIn.reduce((sum, t) => sum + t.quantity, 0);

    // Transfers Out
    let transferOutQuery = {};
    if (baseFilter) transferOutQuery.fromBase = baseFilter;
    if (equipment) transferOutQuery.equipment = equipment;
    if (startDate || endDate) {
      transferOutQuery.transferDate = {};
      if (startDate) transferOutQuery.transferDate.$gte = new Date(startDate);
      if (endDate) transferOutQuery.transferDate.$lte = new Date(endDate);
    }
    const transfersOut = await Transfer.find(transferOutQuery);
    const totalTransferOut = transfersOut.reduce((sum, t) => sum + t.quantity, 0);

    // Assignments & Expended
    let assignQuery = {};
    if (baseFilter) assignQuery.base = baseFilter;
    if (equipment) assignQuery.equipment = equipment;
    const assignments = await Assignment.find(assignQuery);
    const totalAssigned = assignments.reduce((sum, a) => sum + a.quantity, 0);
    const totalExpended = assignments.reduce((sum, a) => sum + (a.expendedQuantity || 0), 0);

    const netMovement = totalPurchases + totalTransferIn - totalTransferOut;
    const closingBalance = netMovement;
    const openingBalance = 0;

    res.json({
      openingBalance,
      closingBalance,
      netMovement,
      purchases: totalPurchases,
      transferIn: totalTransferIn,
      transferOut: totalTransferOut,
      assigned: totalAssigned,
      expended: totalExpended,
      details: {
        purchases,
        transfersIn,
        transfersOut
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;