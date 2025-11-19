const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/asyncHandler");
const { sendMail } = require("../Services/userService");
const redis = require("../config/redisConfig");
const emailModel = require("../models/email.model");
const nodeCache = require("node-cache");
const crypto = require("crypto");
const { sendResetPasswordEmail } = require("../utils/email.utils");
require("dotenv").config();

const tokenCache = new nodeCache({ stdTTL: 900 });

const generateAccessToken = (user, exp) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: exp }
  );
};

// Đăng ký
const userRegister = asyncHandler(async (req, res) => {
  const { username, password, email, role, confirmPassword } = req.body;

  if (!username || !password || !email || !confirmPassword) {
    res.status(400);
    throw new Error("Tất cả các trường đều là bắt buộc");
  }

  const user = await userModel.findOne({ email });
  if (user) {
    res.status(400);
    throw new Error("Tài khoản đã tồn tại");
  }

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error("Nhập lại mật khẩu không khớp");
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const newUser = new userModel({
    username,
    email,
    password: hashedPassword,
    role,
  });

  await newUser.save();

  const accessToken = generateAccessToken(newUser, "7d");
  const refreshToken = generateAccessToken(newUser, "14d");

  newUser.refreshToken = refreshToken;
  await newUser.save();

  delete newUser._doc.password;

  res.status(201).json({
    message: "Đăng ký thành công",
    data: {
      ...newUser._doc,
      accessToken,
      refreshToken,
    },
    success: true,
    error: false,
  });
});

// Đăng nhập
const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email, role: "user" });
  if (!user) {
    res.status(400);
    throw new Error("Tài khoản không tồn tại");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("Tài khoản đã bị khóa");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(400);
    throw new Error("Mật khẩu không đúng");
  }

  const accessToken = generateAccessToken(user, "7d");
  const refreshToken = generateAccessToken(user, "14d");

  user.refreshToken = refreshToken;
  await user.save();

  delete user._doc.password;

  res.status(200).json({
    message: "Đăng nhập thành công",
    data: {
      ...user._doc,
      accessToken,
      refreshToken,
    },
    success: true,
    error: false,
  });
});

// Lấy thông tin user
const userDetails = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const user = await userModel.findById(userId).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("Người dùng không tồn tại");
  }

  res.status(200).json({
    success: true,
    data: {
      ...user._doc,
    },
    error: false,
  });
});

// Đăng xuất
const userLogout = asyncHandler(async (req, res) => {
  const userId = req.userId;

  await userModel.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });

  res.status(200).json({
    success: true,
    message: "Đăng xuất thành công",
  });
});
const sentEmail = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { subject, content } = req.body;
  await sendMail(userId, subject, content);
  return res.status(200).json({
    message: "đã gửi email tới quản trị viên",
    success: true,
    error: false,
  });
});
const getTotalUser = asyncHandler(async (req, res) => {
  const userCount = await userModel.countDocuments();
  res.status(200).json({
    data: userCount,
    success: true,
  });
});

const getUnreadEmailCount = asyncHandler(async (req, res) => {
  // Sử dụng countDocuments() để đếm số lượng tài liệu khớp với điều kiện isRead: false
  const unreadCount = await emailModel.countDocuments({
    isRead: false,
  });

  res.status(200).json({
    success: true,
    message: "Lấy số lượng email chưa đọc thành công",
    data: {
      unreadCount: unreadCount,
    },
  });
});
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    res.status(404);
    return res.json({
      message: "Link reset password đã được gửi đến email của bạn",
      success: true,
    });
  }
  const token = crypto.randomBytes(20).toString("hex");
  await tokenCache.set(`reset:${user._id}`, token); // Token hợp lệ trong 15 phút
  const resetLink = `https://webtravel.click/reset-password?token=${token}&id=${user._id}`;
  // Gửi email với link reset password
  await sendResetPasswordEmail(email, resetLink);
  return res.status(200).json({
    message: "Link reset password đã được gửi đến email của bạn",
    success: true,
  });
});
const resetPassword = asyncHandler(async (req, res) => {
  const { userId, token, newPassword } = req.body;
  const savedToken = tokenCache.get(`reset:${userId}`);
  if (!savedToken || savedToken !== token) {
    res.status(400);
    throw new Error("Token không hợp lệ hoặc đã hết hạn");
  }
    // Lấy thông tin user trước khi update
  const user = await userModel.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("Người dùng không tồn tại");
  }
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(newPassword, salt);
  await userModel.findByIdAndUpdate(userId, {
    password: hashedPassword,
    refreshToken: null,
  });
  await tokenCache.del(`reset:${userId}`);
  return res.status(200).json({
    message: "Đặt lại mật khẩu thành công",
    success: true,
    role: user.role
  });
});
module.exports = {
  userRegister,
  userLogin,
  userDetails,
  userLogout,
  forgotPassword,
  resetPassword,
  generateAccessToken,
  sentEmail,
  getTotalUser,
  getUnreadEmailCount,
};
