const asyncHandler = require("../middleware/asyncHandler");
const userModel = require("../models/user.model");
const { blockUser } = require("../Services/userService");
const { generateAccessToken } = require("./user.controller");
const bcrypt = require("bcryptjs");
const adminLogin = asyncHandler(async (req, res) => {
  // Your admin login logic here
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email và mật khẩu là bắt buộc" });
  }
  const admin = await userModel.findOne({ email, role: "admin" });
  if (!admin) {
    return res.status(401).json({ message: "Không tìm thấy tài khoản admin" });
  }
  if (admin.isActive === false) {
    return res.status(403).json({ message: "Tài khoản đã bị khoá" });
  }
  const isPasswordValid = bcrypt.compareSync(password, admin.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Mật khẩu không đúng" });
  }
  const accessToken = generateAccessToken(admin, "7d");
  const refreshToken = generateAccessToken(admin, "14d");
  admin.refreshToken = refreshToken;
  await admin.save();
  delete admin._doc.password;
  return res.status(200).json({
    message: "Đăng nhập thành công",
    data: {
      user: {
        ...admin._doc,
      },
      accessToken,
      refreshToken,
    },
    success: true,
    error: false,
  });
});
const blockedUser = async (req, res) => {
  const userId = req.params.id;
  const currentUserId = req.userId;

  if (userId.toString() === currentUserId.toString()) {
    return res.status(403).json({
      message: "Bạn không thể khóa tài khoản của mình",
    });
  }
  await blockUser(userId);
  return res.status(200).json({
    success: true,
    message: "tài khoản đã bị khóa",
  });
};
const unBlockedUser = async (req, res) => {
  const userId = req.params.id;
  const unBlockUser = await userModel.findByIdAndUpdate(
    userId,
    { isActive: true },
    { new: true }
  );
  if (!unBlockUser) {
    return res.status(404).json({ message: "Người dùng không tồn tại" });
  }
  return res.status(200).json({
    success: true,
    message: "tài khoản đã được mở khóa",
  });
};
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userModel.find().select("-password");
  return res.status(200).json({
    message: "Lấy danh sách người dùng thành công",
    data: users,
  });
});
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) {
    res.status(400);
    return res.json({ message: "Vui lòng cung cấp đầy đủ thông tin", success: false,error: true  });
  }

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    res.status(400);
    return res.json({ message: "Email đã được sử dụng", success: false,error: true  });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new userModel({
    username,
    email,
    password: hashedPassword,
    role
  });
  await newUser.save();
  return res.status(201).json({
    success: true,
    message: "Tạo người dùng thành công",
    data: newUser
  });
});

module.exports = {
  blockedUser,
  unBlockedUser,
  adminLogin,
  getAllUsers,
  createUser,
};
