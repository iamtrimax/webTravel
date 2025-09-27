const emailModel = require("../models/email.model");
const userModel = require("../models/user.model");

let io, onlineUsers;

const setSocketServer = (socketServer, onlineMap) => {
  io = socketServer;
  onlineUsers = onlineMap;
};
// Hàm bắn event block user
const blockUser = async (userId) => {
  // Lấy user từ DB
  const user = await userModel.findById(userId);
  if (!user) {
    throw new Error("Người dùng không tồn tại");
  }

  // Nếu đang active thì khóa, nếu đang khóa thì mở lại
  const newStatus = user.isActive ? false : true;

  // Update DB
  user.isActive = newStatus;
  await user.save();

  // Nếu bị khóa thì gửi thông báo real-time
  if (!newStatus) {
    const socketId = onlineUsers.get(userId);
    if (socketId) {
      io.to(socketId).emit("blocked", { message: "Tài khoản đã bị khóa" });
    }
  }

  return user;
};
const sendMail = async (userId, subject, content) => {
  const newEmail = new emailModel({ subject, content, userId });
  await newEmail.save();
  const populatedEmail = await newEmail.populate("userId", "username email");
  // bắn cho user nếu online
  const socketId = onlineUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit("sent", populatedEmail);
  }

  // bắn cho tất cả admin
  io.to("admins").emit("sent", populatedEmail);

  return newEmail;
};
const updateRoleService = async (userId, role) => {
  const user = await userModel.findById(userId);
  if (!user) return null;

  user.role = role;
  await user.save();

  const socketId = onlineUsers.get(userId);
  socketId &&
    io.to(socketId).emit("updated role", {
      message: `bạn đã được thay đổi quyền truy cập sang ${role}`,
      newRole: role,
    });

  return user;
};
const deleteUserService = async (userId) => {
  const user = await userModel.findByIdAndDelete(userId);
  const socketId = onlineUsers.get(userId);
  socketId &&
    io.to(socketId).emit("deleted", {
      message: `bạn đã bị xoá khỏi hệ thống`,
    });

  return user;
};
module.exports = {
  blockUser,
  setSocketServer,
  sendMail,
  updateRoleService,
  deleteUserService,
};
