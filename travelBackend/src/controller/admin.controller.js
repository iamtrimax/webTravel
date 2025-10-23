const { redis, getStatus } = require("../config/redisConfig");
const asyncHandler = require("../middleware/asyncHandler");
const emailModel = require("../models/email.model");
const userModel = require("../models/user.model");
const {
  blockUser,
  updateRoleService,
  deleteUserService,
} = require("../Services/userService");
const { adminReplyEmail } = require("../utils/email.utils");
const { generateAccessToken } = require("./user.controller");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
const deleteImage = asyncHandler(async (req, res) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res
        .status(400)
        .json({ success: false, message: "public_id is required" });
    }

    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === "ok") {
      return res.json({ success: true, result });
    } else {
      return res.status(400).json({ success: false, result });
    }
  } catch (err) {
    console.error("Delete image error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});
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
const toggleBlockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUserId = req.userId;

    if (userId.toString() === currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Bạn không thể tự khóa/mở khóa tài khoản của mình",
      });
    }

    const updatedUser = await blockUser(userId);

    return res.status(200).json({
      success: true,
      message: updatedUser.isActive
        ? "Tài khoản đã được mở khóa"
        : "Tài khoản đã bị khóa",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Lỗi toggle user:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};
const getAllUsers = asyncHandler(async (req, res) => {
  const isRedisConnected = getStatus();
  if (isRedisConnected) {
    const cacheUser = await redis.get("all-user");
    if (cacheUser) {
      return res.status(200).json({
        message: "Lấy danh sách người dùng từ cache thành công",
        data: JSON.parse(cacheUser),
      });
    }
  }

  const users = await userModel.find().select("-password");
  if (isRedisConnected) {
    redis
      .setEx("all-user", 300, JSON.stringify(users))
      .then(() => console.log("✅ Cache updated"))
      .catch((err) => console.log("❌ Cache update failed:", err.message));
  }
  return res.status(200).json({
    message: "Lấy danh sách người dùng thành công",
    data: users,
  });
});
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) {
    res.status(400);
    return res.json({
      message: "Vui lòng cung cấp đầy đủ thông tin",
      success: false,
      error: true,
    });
  }

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    res.status(400);
    return res.json({
      message: "Email đã được sử dụng",
      success: false,
      error: true,
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new userModel({
    username,
    email,
    password: hashedPassword,
    role,
  });
  await newUser.save();
  const isRedisConnected = getStatus();
  if (isRedisConnected) await redis.del("all-user");
  return res.status(201).json({
    success: true,
    message: "Tạo người dùng thành công",
    data: newUser,
  });
});
const updateRoleUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;
  if (!role) {
    return res.status(400).json({
      message: "quyền không được để trống",
      success: false,
      error: true,
    });
  }
  const updated = await updateRoleService(userId, role);
  if (!updated) {
    return res
      .status(404)
      .json({ message: "Không tìm thấy user", success: false, error: true });
  }
  return res.status(200).json({
    message: "Cập nhật quyền user thành công",
    data: updated,
    error: false,
    success: true,
  });
});
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  if (userId.toString() === req.userId.toString()) {
    return res.status(403).json({
      message: "Bạn không thể xoá chính mình",
      success: false,
      error: true,
    });
  }
  const deleted = await deleteUserService(userId);
  if (deleted)
    return res
      .status(200)
      .json({ message: "Xoá user thành công", success: true, error: false });
});
const getAllEmail = asyncHandler(async (req, res) => {
  const email = await emailModel.find().populate("userId").lean();
  return res.status(200).json({
    data: email,
    success: true,
    error: false,
  });
});
// replyEmail
const replyEmail = asyncHandler(async (req, res) => {
  const { userEmail, subject, content } = req.body;
  console.log(userEmail, subject, content);
  if (!userEmail) {
    return res.status(400).json({
      message: "bạn không thể reply email này",
      error: true,
      success: false,
    });
  }
  await adminReplyEmail(userEmail, subject, content);

  return res.status(200).json({
    message: "Đã gửi phản hồi email",
    success: true,
    error: false,
  });
});

module.exports = {
  toggleBlockUser,
  adminLogin,
  getAllUsers,
  createUser,
  updateRoleUser,
  deleteUser,
  deleteImage,
  getAllEmail,
  replyEmail,
};
