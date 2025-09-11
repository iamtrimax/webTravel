const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { blockUser } = require("../Services/userService");
require("dotenv").config();
const generateAccessToken = (user, exp) =>{
  return jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: exp });
}
const userRegister = async (req, res) => {
  try {
    const { username, password, email, role, confirmPassword } = req.body;

    if (!username || !password  || !email || !confirmPassword) {
      return res.status(400).json({
        message: "Tất cả các trường đều là bắt buộc",
      });
    }
    // Continue with user registration logic
    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Tài khoản đã tồn tại",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Nhập lại mật khẩu không khớp",
      });
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      if (!hashedPassword) {
        return res.status(500).json({
          message: "Đăng ký không thành công",
          success: false,
          error: true,
        });
      }
      const newUser = new userModel({
        username,
        email,
        password: hashedPassword,
        role
      });
      await newUser.save();
      accessToken = generateAccessToken(newUser, "7d");
      refreshToken = generateAccessToken(newUser, '14d');
      newUser.refreshToken = refreshToken;
      await newUser.save();
      delete newUser._doc.password;
      return res.status(201).json({
        message: "Đăng ký thành công",
        data: {
          ...newUser._doc,
          accessToken,
          refreshToken
        },
        success: true,
        error: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "Tài khoản không tồn tại",
      success: false,
      error: true,
    });
  }
  if (!user.isActive) {
    return res.status(403).json({ message: "Tài khoản đã bị khóa" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({
      message: "Mật khẩu không đúng",
      success: false,
      error: true,
    });
  }
  const accessToken = generateAccessToken(user, "7d");
  const refreshToken = generateAccessToken(user, '14d');
  user.refreshToken = refreshToken;
  await user.save();
  delete user._doc.password;
  return res.status(200).json({
    message: "Đăng nhập thành công",
    data: {
      ...user._doc,
      accessToken,
      refreshToken
    },
    success: true,
    error: false,
  });
}
const userDetails = async (req, res) => {
  const userId = req.userId;
  
  try {
    const user = await userModel.findById(userId).select('-password');
    delete user._doc.password;
    return res.status(200).json({
      success: true,
      data: {
        ...user._doc,
      },
      error: false
    })
  } catch (error) {
    console.log("errors:  ",error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const userLogout = async (req, res) => {
  const userId = req.userId;
  try {
    await userModel.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
    return res.status(200).json({
      success: true,
      message: "Đăng xuất thành công"
    });
  } catch (error) {
    console.log("errors:  ",error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const blockedUser = async (req, res) => {
  const userId = req.params.id;
  await blockUser (userId);
  return res.status(200).json({
    success: true,
    message: "tài khoản đã bị khóa"
  });
}
module.exports = { userRegister, userLogin, userDetails,userLogout, blockedUser };
