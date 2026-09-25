const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const generateOrderNumber = require('../utils/generateOrderNumber');

// @desc    ثبت سفارش جدید (از صفحه محصول / سبد خرید)
// @route   POST /api/orders
// @access  عمومی (کاربر مهمان هم می‌تواند سفارش ثبت کند)
const createOrder = asyncHandler(async (req, res) => {
  const { customer, items } = req.body;

  if (!customer || !customer.name || !customer.phone || !customer.address) {
    res.status(400);
    throw new Error('اطلاعات مشتری (نام، شماره تماس، آدرس) الزامی است');
  }
  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error('سبد خرید نمی‌تواند خالی باشد');
  }

  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`محصول با شناسه ${item.product} یافت نشد`);
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`موجودی «${product.name}» کافی نیست`);
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    });
    totalAmount += product.price * item.quantity;

    // کسر موجودی محصول
    product.stock -= item.quantity;
    await product.save();
  }

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    user: req.user ? req.user._id : undefined,
    customer,
    items: orderItems,
    totalAmount,
  });

  res.status(201).json({ success: true, data: order });
});

// @desc    دریافت لیست سفارش‌ها (با فیلتر وضعیت و صفحه‌بندی) — برای جدول داشبورد
// @route   GET /api/orders?status=&page=&limit=
// @access  خصوصی/ادمین
const getOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  const query = {};
  if (status) query.status = status;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    Order.find(query).sort('-createdAt').skip(skip).limit(limitNum),
    Order.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: orders.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: orders,
  });
});

// @desc    دریافت جزئیات یک سفارش
// @route   GET /api/orders/:id
// @access  خصوصی/ادمین
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.product', 'name images');
  if (!order) {
    res.status(404);
    throw new Error('سفارش یافت نشد');
  }
  res.json({ success: true, data: order });
});

// @desc    تغییر وضعیت سفارش (مثلاً از «در حال ارسال» به «تحویل شد»)
// @route   PATCH /api/orders/:id/status
// @access  خصوصی/ادمین
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending_payment', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('وضعیت ارسالی معتبر نیست');
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('سفارش یافت نشد');
  }

  order.status = status;
  await order.save();
  res.json({ success: true, data: order });
});

// @desc    حذف سفارش
// @route   DELETE /api/orders/:id
// @access  خصوصی/ادمین
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('سفارش یافت نشد');
  }

  await order.deleteOne();
  res.json({ success: true, message: 'سفارش حذف شد' });
});

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus, deleteOrder };
