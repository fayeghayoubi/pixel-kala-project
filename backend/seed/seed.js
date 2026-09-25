require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const categories = [
  { name: 'لپ‌تاپ و کامپیوتر', slug: 'laptop', icon: '💻' },
  { name: 'هدفون و صوتی', slug: 'audio', icon: '🎧' },
  { name: 'ساعت هوشمند', slug: 'smartwatch', icon: '⌚' },
  { name: 'لوازم جانبی', slug: 'accessories', icon: '🔌' },
];

const run = async () => {
  await connectDB();

  if (process.argv.includes('--destroy')) {
    await Promise.all([User.deleteMany(), Category.deleteMany(), Product.deleteMany()]);
    console.log('🗑️  همه‌ی داده‌ها پاک شدند');
    process.exit();
  }

  await Promise.all([User.deleteMany(), Category.deleteMany(), Product.deleteMany()]);

  const createdCategories = await Category.insertMany(categories);
  const bySlug = (slug) => createdCategories.find((c) => c.slug === slug)._id;

  await Product.insertMany([
    {
      name: 'هدفون بی‌سیم نویز‌کنسل Aurora X1',
      slug: 'aurora-x1',
      brand: 'Aurora Audio',
      category: bySlug('audio'),
      description: 'حذف نویز فعال دو‌طرفه، ۳۶ ساعت پخش مداوم و اتصال هم‌زمان به دو دستگاه.',
      price: 4250000,
      oldPrice: 5000000,
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=80',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=900&q=80',
      ],
      colors: ['#12141c', '#f2ede1', '#2fbf7a'],
      specs: [
        { label: 'نوع درایور', value: 'دینامیک ۴۰ میلی‌متری' },
        { label: 'حذف نویز فعال', value: 'تا ۳۵ دسی‌بل، ۳ سطح' },
        { label: 'زمان پخش', value: '۳۶ ساعت' },
        { label: 'نوع اتصال', value: 'بلوتوث ۵.۳ + جک ۳.۵ میلی‌متری' },
      ],
      stock: 4,
      lowStockThreshold: 10,
      rating: 4.6,
      reviewsCount: 124,
      isFeatured: true,
    },
    {
      name: 'ساعت هوشمند Pulse Fit 3',
      slug: 'pulse-fit-3',
      brand: 'Pulse',
      category: bySlug('smartwatch'),
      description: 'پایش ضربان قلب، خواب و ورزش با باتری ۱۰ روزه.',
      price: 3190000,
      images: ['https://images.unsplash.com/photo-1587825140708-dfaf72ae2b04?w=900&q=80'],
      colors: ['#12141c', '#2fbf7a'],
      specs: [
        { label: 'صفحه‌نمایش', value: 'AMOLED ۱.۴ اینچ' },
        { label: 'باتری', value: 'تا ۱۰ روز کارکرد' },
        { label: 'مقاومت آب', value: '5ATM' },
      ],
      stock: 7,
      lowStockThreshold: 10,
      rating: 4.8,
      reviewsCount: 89,
      isFeatured: true,
    },
    {
      name: 'لپ‌تاپ اولترابوک Nimbus 14',
      slug: 'nimbus-14',
      brand: 'Nimbus',
      category: bySlug('laptop'),
      description: 'لپ‌تاپ سبک ۱.۲ کیلوگرمی با باتری ۱۸ ساعته، مناسب کار روزانه و سفر.',
      price: 48900000,
      images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&q=80'],
      colors: ['#12141c'],
      specs: [
        { label: 'پردازنده', value: 'Core Ultra 7' },
        { label: 'حافظه رم', value: '16GB LPDDR5' },
        { label: 'حافظه داخلی', value: '1TB SSD NVMe' },
        { label: 'وزن', value: '1.2 کیلوگرم' },
      ],
      stock: 15,
      lowStockThreshold: 10,
      rating: 4.5,
      reviewsCount: 56,
      isFeatured: true,
      isNew: true,
    },
    {
      name: 'اسپیکر قابل‌حمل Boom Mini',
      slug: 'boom-mini',
      brand: 'Boom',
      category: bySlug('audio'),
      description: 'اسپیکر بلوتوثی جیبی با صدای پرقدرت و مقاومت در برابر آب.',
      price: 1750000,
      images: ['https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=900&q=80'],
      colors: ['#12141c', '#f2ede1'],
      specs: [
        { label: 'توان خروجی', value: '20 وات' },
        { label: 'مقاومت آب', value: 'IPX7' },
        { label: 'زمان پخش', value: '۱۲ ساعت' },
      ],
      stock: 11,
      lowStockThreshold: 10,
      rating: 4.4,
      reviewsCount: 203,
      isFeatured: true,
    },
    {
      name: 'شارژر سریع GaN 65W',
      slug: 'gan-charger-65w',
      brand: 'VoltCore',
      category: bySlug('accessories'),
      description: 'شارژر فست‌شارژ سه‌پورته با فناوری GaN برای شارژ هم‌زمان لپ‌تاپ و گوشی.',
      price: 980000,
      images: ['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=900&q=80'],
      colors: ['#f2ede1'],
      specs: [
        { label: 'توان خروجی', value: '65 وات' },
        { label: 'تعداد پورت', value: '۲ عدد USB-C + ۱ عدد USB-A' },
      ],
      stock: 2,
      lowStockThreshold: 10,
      rating: 4.3,
      reviewsCount: 34,
    },
  ]);

  await User.create({
    name: 'فایق رضایی',
    email: 'admin@pixelkala.ir',
    password: 'admin123',
    role: 'admin',
  });

  console.log('✅ داده‌های نمونه با موفقیت وارد شدند');
  console.log('👤 کاربر ادمین: admin@pixelkala.ir / admin123');
  process.exit();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
