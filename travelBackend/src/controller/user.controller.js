const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { data } = require("react-router-dom");
require("dotenv").config();
const generateAccessToken = (user, exp) =>{
  return jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: exp });
}
const userRegister = async (req, res) => {
  try {
    const { username, password, email, role, repassword } = req.body;

    if (!username || !password  || !email || !repassword) {
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
    if (password !== repassword) {
      return res.status(400).json({
        message: "Nhập lại mật khẩu không khớp",
      });
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      if (!hashedPassword) {
        return res.status(500).json({
          message: "Đăng ký không thành công",
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
      delete newUser._doc.refreshToken;
      return res.status(201).json({
        message: "Đăng ký thành công",
        data: {
          ...newUser._doc,
          accessToken,
        }
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
    });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({
      message: "Mật khẩu không đúng",
    });
  }
  const accessToken = generateAccessToken(user, "7d");
  const refreshToken = generateAccessToken(user, '14d');
  user.refreshToken = refreshToken;
  await user.save();
  delete user._doc.refreshToken;
  return res.status(200).json({
    message: "Đăng nhập thành công",
    data: {
      ...user._doc,
      accessToken,
    }
  });
}
module.exports = { userRegister, userLogin };
