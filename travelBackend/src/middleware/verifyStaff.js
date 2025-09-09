const verifyStaff = (req, res, next) => {
  if (req.user.role !== "staff") {
    return res.status(403).json({
      message: "Bạn không có quyền truy cập",
    });
  }
  next();
};
module.exports = verifyStaff;
