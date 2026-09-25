const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// یک تاریخ N روز قبل را برمی‌گرداند
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
};

// @desc    آمار کارت‌های بالای داشبورد (فروش هفته، سفارش جدید، محصول رو به اتمام، کاربر فعال)
// @route   GET /api/dashboard/stats
// @access  خصوصی/ادمین
const getStats = asyncHandler(async (req, res) => {
  const last7 = daysAgo(7);
  const prev7 = daysAgo(14);

  const [thisWeekOrders, lastWeekOrders, lowStockCount, activeUsers] = await Promise.all([
    Order.find({ createdAt: { $gte: last7 }, status: { $ne: 'cancelled' } }),
    Order.find({ createdAt: { $gte: prev7, $lt: last7 }, status: { $ne: 'cancelled' } }),
    Product.countDocuments({ $expr: { $lte: ['$stock', '$lowStockThreshold'] } }),
    User.countDocuments({ isActive: true, role: 'customer' }),
  ]);

  const sum = (orders) => orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const thisWeekSales = sum(thisWeekOrders);
  const lastWeekSales = sum(lastWeekOrders);

  // درصد تغییر نسبت به هفته قبل، برای فلش روند صعودی/نزولی کارت‌ها
  const trend = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  res.json({
    success: true,
    data: {
      weeklySales: thisWeekSales,
      weeklySalesTrend: trend(thisWeekSales, lastWeekSales),
      newOrders: thisWeekOrders.length,
      newOrdersTrend: trend(thisWeekOrders.length, lastWeekOrders.length),
      lowStockProducts: lowStockCount,
      activeUsers,
    },
  });
});

// @desc    داده‌ی نمودار میله‌ای فروش هفتگی (۷ روز اخیر)
// @route   GET /api/dashboard/weekly-sales
// @access  خصوصی/ادمین
const getWeeklySales = asyncHandler(async (req, res) => {
  const since = daysAgo(6); // شامل امروز = ۷ روز

  const orders = await Order.find({
    createdAt: { $gte: since },
    status: { $ne: 'cancelled' },
  });

  const dayLabels = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
  const buckets = Array.from({ length: 7 }, (_, i) => {
    const date = daysAgo(6 - i);
    return { date, label: dayLabels[date.getDay()], total: 0 };
  });

  orders.forEach((order) => {
    const orderDate = new Date(order.createdAt);
    orderDate.setHours(0, 0, 0, 0);
    const bucket = buckets.find((b) => b.date.getTime() === orderDate.getTime());
    if (bucket) bucket.total += order.totalAmount;
  });

  res.json({
    success: true,
    data: buckets.map((b) => ({ label: b.label, total: b.total })),
  });
});

// @desc    لیست محصولات رو به اتمام (برای پنل داشبورد)
// @route   GET /api/dashboard/low-stock
// @access  خصوصی/ادمین
const getLowStock = asyncHandler(async (req, res) => {
  const products = await Product.find({
    $expr: { $lte: ['$stock', '$lowStockThreshold'] },
    isActive: true,
  })
    .select('name stock lowStockThreshold images')
    .sort('stock')
    .limit(10);

  res.json({ success: true, data: products });
});

module.exports = { getStats, getWeeklySales, getLowStock };
