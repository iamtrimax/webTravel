const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const route = require("./src/Route/routes");
const connectMongoDb = require("./src/config/dbConfig");
const errorHandler = require("./src/middleware/errorHandler");
const { Server } = require("socket.io");
const { setSocketServer } = require("./src/Services/userService");
const app = express();
const PORT = 3000;
require("dotenv").config();
app.use(
  cors({
    origin: "http://localhost:5173", // Đúng với frontend
    credentials: true, // Quan trọng!
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", route);
app.use(errorHandler);
connectMongoDb().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // thay bằng domain frontend
      methods: ["GET", "POST"],
    },
  });

  // Map lưu userId => socketId
  let onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Nhận userId từ client khi login
    socket.on("register", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log("User registered:", userId);
    });

    // Xóa khi disconnect
    socket.on("disconnect", () => {
      for (let [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      console.log("User disconnected:", socket.id);
    });
    setSocketServer(io, onlineUsers);
  });
});
