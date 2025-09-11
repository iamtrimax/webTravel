const userModel = require("../models/user.model");

let io, onlineUsers;

const setSocketServer = (socketServer, onlineMap) => {
  io = socketServer;
  onlineUsers = onlineMap;
};
// Hàm bắn event block user
const blockUser = async (userId) => {
  const socketId = onlineUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit("blocked", { message: "Tài khoản đã bị khóa" });
  }

  // Update DB
  await userModel.findByIdAndUpdate(userId, { isActive: false });
};
module.exports = { blockUser, setSocketServer };
