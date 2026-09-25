const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/').get(protect, adminOnly, getOrders).post(createOrder);

router
  .route('/:id')
  .get(protect, adminOnly, getOrderById)
  .delete(protect, adminOnly, deleteOrder);

router.patch('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
