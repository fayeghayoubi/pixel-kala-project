# بک‌اند پیکسل‌کالا

بک‌اند فروشگاه لوازم الکترونیکی، با Node.js + Express + MongoDB (Mongoose) و احراز هویت JWT.

## نصب و اجرا

```bash
npm install
cp .env.example .env
# مقدار MONGO_URI و JWT_SECRET را در .env تنظیم کنید

npm run seed   # پر کردن دیتابیس با داده‌ی نمونه (دسته‌بندی، محصول، کاربر ادمین)
npm run dev    # اجرای سرور با nodemon روی http://localhost:4000
```

کاربر ادمین نمونه بعد از seed:
- ایمیل: `admin@pixelkala.ir`
- رمز عبور: `admin123`

## ساختار پروژه

```
backend/
├── server.js              نقطه ورود اصلی
├── config/db.js           اتصال به MongoDB
├── models/                اسکیمای Mongoose (User, Category, Product, Order)
├── controllers/           منطق هر روت
├── routes/                تعریف مسیرهای API
├── middleware/auth.js     محافظت از روت‌ها + بررسی نقش ادمین
├── middleware/errorHandler.js   هندلر مرکزی خطا
├── utils/                 توابع کمکی (تولید توکن، شماره سفارش)
└── seed/seed.js           داده‌ی نمونه هماهنگ با صفحات فرانت‌اند
```

## خلاصه‌ی endpointها

| روش | مسیر | دسترسی | توضیح |
|---|---|---|---|
| POST | `/api/auth/register` | عمومی | ثبت‌نام |
| POST | `/api/auth/login` | عمومی | ورود و دریافت توکن |
| GET  | `/api/auth/me` | خصوصی | اطلاعات کاربر لاگین‌کرده |
| GET  | `/api/categories` | عمومی | لیست دسته‌بندی‌ها |
| POST/PUT/DELETE | `/api/categories` | ادمین | مدیریت دسته‌بندی |
| GET  | `/api/products` | عمومی | لیست محصولات (فیلتر/جستجو/صفحه‌بندی) |
| GET  | `/api/products/:id` | عمومی | جزئیات محصول (با id یا slug) |
| GET  | `/api/products/:id/related` | عمومی | محصولات مشابه |
| POST/PUT/DELETE | `/api/products` | ادمین | مدیریت محصول |
| POST | `/api/orders` | عمومی | ثبت سفارش (کسر خودکار موجودی) |
| GET  | `/api/orders` | ادمین | لیست سفارش‌ها |
| GET  | `/api/orders/:id` | ادمین | جزئیات سفارش |
| PATCH | `/api/orders/:id/status` | ادمین | تغییر وضعیت سفارش |
| DELETE | `/api/orders/:id` | ادمین | حذف سفارش |
| GET | `/api/dashboard/stats` | ادمین | آمار کارت‌های داشبورد |
| GET | `/api/dashboard/weekly-sales` | ادمین | داده‌ی نمودار میله‌ای هفتگی |
| GET | `/api/dashboard/low-stock` | ادمین | محصولات رو به اتمام |

## اتصال به فرانت‌اند

برای درخواست‌های محافظت‌شده، توکن دریافتی از `/api/auth/login` را در هدر بفرستید:

```
Authorization: Bearer <token>
```

فایل `pixel-kala-api.postman_collection.json` را در Postman ایمپورت کنید تا همه‌ی endpointها آماده‌ی تست باشند (متغیرهای `baseUrl` و `token` به‌صورت خودکار در کالکشن تنظیم می‌شوند).
