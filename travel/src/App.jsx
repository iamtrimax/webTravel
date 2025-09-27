import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Context from './Context/Context';
import { useDispatch } from 'react-redux';
import { clearUser, setUser } from './Store/userSlice';
import sumaryApi from './common';
import Layout from './Layout/Layout';
import LayoutAdmin from './Layout/LayoutAdmin';
import socket, { connectSocket } from './Socket/Socket';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const dispatch = useDispatch();
  const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate()

  const fetchUserDetails = async () => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      try {
        const res = await fetch(sumaryApi.getUserDetails.url, {
          method: sumaryApi.getUserDetails.method,
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          dispatch(setUser(data.data));
        } else {
          console.log(data.message || "Failed to fetch user details");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    setLoadingUser(false); // luôn set false sau khi gọi xong
  };

  useEffect(() => {
    fetchUserDetails();

    connectSocket()
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);


      socket.emit("register");

    });


    socket.on("updated role", (data) => {
      alert(data.message);
      console.log(data.newRole);

      if (data.newRole == "admin")
        navigate("/")
      if (data.newRole == "user") {

        navigate("/login");
        dispatch(clearUser())
        localStorage.removeItem("accessToken")
      }
    });
    socket.on("deleted", (data) => {
      alert(data.message)
      localStorage.removeItem("accessToken");
      dispatch(clearUser())

      navigate("/")
    })

    socket.on("disconnect", () => {
      console.log("❌ socket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connect error:", err);
    });

    return () => {
      socket.off("connect");
      socket.off("updated role");
      socket.off("disconnect");
      socket.off("connect_error");
      // socket.disconnect()  // 👉 chỉ nên gọi khi logout
    };
  }, []);

  useEffect(() => {
    socket.on("blocked", (data) => {
      alert(data.message);
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    });
    return () => {
      socket.off("blocked");
    };
  }, []);

  return (
    <Context.Provider value={{ fetchUserDetails, loadingUser }}>
      <ToastContainer position="top-right" />
      {isAdminRoute ? <LayoutAdmin /> : <Layout />}
    </Context.Provider>
  );
}

export default App;
