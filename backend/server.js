require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// اتصال به دیتابیس
connectDB();

const app = express();

// میدلورهای پایه
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// روت سلامت سرور
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'سرور پیکسل‌کالا در حال اجراست ✅' });
});

// روت‌های اصلی
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// هندل خطاها (باید بعد از همه‌ی روت‌ها باشند)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 سرور روی پورت ${PORT} در حال اجراست`);
});
