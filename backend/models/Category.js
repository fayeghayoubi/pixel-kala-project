const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'نام دسته‌بندی الزامی است'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    icon: {
      type: String, // مثلاً یک ایموجی یا نام آیکون: 💻
      default: '📦',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
