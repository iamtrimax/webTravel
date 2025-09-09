const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Bạn không có quyền truy cập",
    });
  }
  next();
};
module.exports = verifyAdmin;
