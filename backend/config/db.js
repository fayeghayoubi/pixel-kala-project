const mongoose = require('mongoose');

// اتصال به دیتابیس MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB متصل شد: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ خطا در اتصال به دیتابیس: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
