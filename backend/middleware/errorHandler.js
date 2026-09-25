// وقتی هیچ روتی با آدرس درخواستی مطابقت نداشت
const notFound = (req, res, next) => {
  const error = new Error(`آدرس یافت نشد: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// هندلر مرکزی خطا — همه throw new Error() های کنترلرها اینجا می‌رسند
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // خطای فرمت نامعتبر ObjectId مانگو
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'شناسه ارسالی معتبر نیست';
  }

  // خطای تکراری بودن مقدار یکتا (مثل ایمیل تکراری)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = `مقدار وارد شده برای «${field}» قبلاً ثبت شده است`;
  }

  // خطای اعتبارسنجی مدل مانگو
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(' — ');
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
