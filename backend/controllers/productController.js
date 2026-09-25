const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    دریافت لیست محصولات (با فیلتر دسته‌بندی، جستجو، مرتب‌سازی و صفحه‌بندی)
// @route   GET /api/products?category=&search=&sort=&page=&limit=&featured=
// @access  عمومی
const getProducts = asyncHandler(async (req, res) => {
  const { category, search, sort, featured, page = 1, limit = 12 } = req.query;

  const query = { isActive: true };
  if (category) query.category = category;
  if (featured) query.isFeatured = featured === 'true';
  if (search) query.$text = { $search: search };

  const sortMap = {
    newest: '-createdAt',
    price_asc: 'price',
    price_desc: '-price',
    rating: '-rating',
  };
  const sortBy = sortMap[sort] || '-createdAt';

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(query).populate('category', 'name slug').sort(sortBy).skip(skip).limit(limitNum),
    Product.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: products.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: products,
  });
});

// @desc    دریافت جزئیات یک محصول با شناسه یا slug
// @route   GET /api/products/:id
// @access  عمومی
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);

  const product = await Product.findOne(isObjectId ? { _id: id } : { slug: id }).populate(
    'category',
    'name slug'
  );

  if (!product) {
    res.status(404);
    throw new Error('محصول یافت نشد');
  }

  res.json({ success: true, data: product });
});

// @desc    ساخت محصول جدید
// @route   POST /api/products
// @access  خصوصی/ادمین
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
});

// @desc    ویرایش محصول
// @route   PUT /api/products/:id
// @access  خصوصی/ادمین
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('محصول یافت نشد');
  }

  Object.assign(product, req.body);
  await product.save();
  res.json({ success: true, data: product });
});

// @desc    حذف محصول
// @route   DELETE /api/products/:id
// @access  خصوصی/ادمین
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('محصول یافت نشد');
  }

  await product.deleteOne();
  res.json({ success: true, message: 'محصول حذف شد' });
});

// @desc    دریافت محصولات مشابه (بر اساس دسته‌بندی، به‌جز خود محصول)
// @route   GET /api/products/:id/related
// @access  عمومی
const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('محصول یافت نشد');
  }

  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true,
  }).limit(4);

  res.json({ success: true, data: related });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
};
