// socket.js
import { io } from "socket.io-client";

const socket = io("https://api.webtravel.click", {
  autoConnect: false,
}); // backend URL
export const connectSocket = () => {
  const token = localStorage.getItem("accessToken");
  
  if (!token) return;

  socket.auth = { token };
  socket.connect();
};
export default socket;
