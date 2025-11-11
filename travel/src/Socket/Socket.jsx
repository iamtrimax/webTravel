// socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  autoConnect: false,
}); // backend URL
export const connectSocket = () => {
  const token = localStorage.getItem("accessToken");
  
  if (!token) return;

  socket.auth = { token };
  socket.connect();
};
export default socket;
