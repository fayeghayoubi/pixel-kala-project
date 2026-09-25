const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    ثبت‌نام کاربر جدید
// @route   POST /api/auth/register
// @access  عمومی
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('نام، ایمیل و رمز عبور الزامی هستند');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('کاربری با این ایمیل قبلاً ثبت‌نام کرده است');
  }

  const user = await User.create({ name, email, password, phone });

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    },
  });
});

// @desc    ورود کاربر و دریافت توکن
// @route   POST /api/auth/login
// @access  عمومی
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('ایمیل و رمز عبور الزامی هستند');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('ایمیل یا رمز عبور نادرست است');
  }

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    },
  });
});

// @desc    دریافت اطلاعات کاربر لاگین‌کرده‌ی فعلی
// @route   GET /api/auth/me
// @access  خصوصی
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

module.exports = { registerUser, loginUser, getMe };
