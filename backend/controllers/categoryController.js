const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');

// @desc    دریافت همه‌ی دسته‌بندی‌ها
// @route   GET /api/categories
// @access  عمومی
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort('name');
  res.json({ success: true, count: categories.length, data: categories });
});

// @desc    ساخت دسته‌بندی جدید
// @route   POST /api/categories
// @access  خصوصی/ادمین
const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, icon } = req.body;

  if (!name || !slug) {
    res.status(400);
    throw new Error('نام و slug دسته‌بندی الزامی هستند');
  }

  const category = await Category.create({ name, slug, icon });
  res.status(201).json({ success: true, data: category });
});

// @desc    ویرایش دسته‌بندی
// @route   PUT /api/categories/:id
// @access  خصوصی/ادمین
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('دسته‌بندی یافت نشد');
  }

  Object.assign(category, req.body);
  await category.save();
  res.json({ success: true, data: category });
});

// @desc    حذف دسته‌بندی
// @route   DELETE /api/categories/:id
// @access  خصوصی/ادمین
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('دسته‌بندی یافت نشد');
  }

  await category.deleteOne();
  res.json({ success: true, message: 'دسته‌بندی حذف شد' });
});

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
