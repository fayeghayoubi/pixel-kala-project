const express = require('express');
const router = express.Router();
const { getStats, getWeeklySales, getLowStock } = require('../controllers/dashboardController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/stats', protect, adminOnly, getStats);
router.get('/weekly-sales', protect, adminOnly, getWeeklySales);
router.get('/low-stock', protect, adminOnly, getLowStock);

module.exports = router;
