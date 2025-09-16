const userModel = require("../models/user.model");
const { blockUser } = require("../Services/userService");

const blockedUser =  async (req, res) => {
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
module.exports = {
  blockedUser,
  unBlockedUser,
}