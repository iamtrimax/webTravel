const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const route = require("./src/Route/routes");
const connectMongoDb = require("./src/config/dbConfig");
const errorHandler = require("./src/middleware/errorHandler");
const { Server } = require("socket.io");
const { setSocketServer } = require("./src/Services/userService");
const jwt = require("jsonwebtoken");

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
      origin: "*", // thay bằng domain frontend
      methods: ["GET", "POST"],
    },
  });

  // Map lưu userId => socketId
  let onlineUsers = new Map();
  setSocketServer(io, onlineUsers);

  io.use((socket, next) => {
    
 // Kiểm tra nhiều vị trí có thể chứa token
  const token = 
    socket.handshake.auth?.token ||
    socket.handshake.query?.token ||
    socket.handshake.headers?.authorization?.replace('Bearer ', '');
  
  console.log("Token search result:", {
    auth: socket.handshake.auth?.token,
    query: socket.handshake.query?.token,
    headers: socket.handshake.headers?.authorization,
    finalToken: token
  })    

    
    if (!token) return next(new Error("không có token"));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded payload:", decoded);
      socket.userId = decoded.id;
      socket.role = decoded.role;
      next()
    } catch (error) {
      console.error("Socket auth error:", error);
      return next(new Error("Invalid token"));
    }
  });
  io.on("connection", (socket) => {
    console.log("User connected:", socket.userId, socket.role);

    socket.on("register", () => {
      onlineUsers.set(socket.userId, socket.id);
      if (socket.role === "admin") {
        socket.join("admins");
        console.log(`Admin registered: ${socket.id}`);
      } else {
        console.log(`User registered: ${socket.userId} -> ${socket.id}`);
      }
    });

    socket.on("disconnect", () => {
      for (let [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      console.log("User disconnected:", socket.id);
    });
  });
});
