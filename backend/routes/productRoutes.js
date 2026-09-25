const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/').get(getProducts).post(protect, adminOnly, createProduct);

router
  .route('/:id')
  .get(getProductById)
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

router.get('/:id/related', getRelatedProducts);

module.exports = router;
