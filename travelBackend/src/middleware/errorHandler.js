const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
console.log("error đang chạy......");

  res.status(statusCode).json({
    success: false,
    message: err.message || "Lỗi server",
    data: null,
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
};

module.exports = errorHandler;
