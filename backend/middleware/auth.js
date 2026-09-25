const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// این میدلور مطمئن می‌شود کاربر لاگین کرده و توکن معتبر دارد
const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('برای دسترسی به این بخش باید وارد شوید (توکن یافت نشد)');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user || !req.user.isActive) {
      res.status(401);
      throw new Error('کاربر یافت نشد یا غیرفعال است');
    }

    next();
  } catch (error) {
    res.status(401);
    throw new Error('توکن نامعتبر یا منقضی‌شده است');
  }
});

// این میدلور فقط اجازه‌ی عبور به کاربران با نقش ادمین را می‌دهد
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403);
  throw new Error('فقط مدیر فروشگاه به این بخش دسترسی دارد');
};

module.exports = { protect, adminOnly };
