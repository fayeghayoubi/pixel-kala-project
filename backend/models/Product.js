const mongoose = require('mongoose');

const specSchema = new mongoose.Schema(
  {
    label: { type: String, required: true }, // مثل «نوع درایور»
    value: { type: String, required: true }, // مثل «دینامیک ۴۰ میلی‌متری»
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'نام محصول الزامی است'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    price: {
      type: Number,
      required: [true, 'قیمت الزامی است'],
      min: 0,
    },
    oldPrice: {
      type: Number,
      min: 0,
    },
    images: {
      type: [String], // آدرس تصاویر گالری، تصویر اول = تصویر اصلی
      default: [],
    },
    colors: {
      type: [String], // کدهای رنگ هگز برای سواچ‌های رنگ
      default: [],
    },
    specs: {
      type: [specSchema],
      default: [],
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// درصد تخفیف محاسبه‌شده از روی قیمت قبلی و فعلی
productSchema.virtual('discountPercent').get(function () {
  if (!this.oldPrice || this.oldPrice <= this.price) return 0;
  return Math.round(((this.oldPrice - this.price) / this.oldPrice) * 100);
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// ایندکس برای جستجوی متنی روی نام و توضیحات
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
