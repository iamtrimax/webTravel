import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Context from './Context/Context';
import { useDispatch } from 'react-redux';
import { setUser } from './Store/userSlice';
import sumaryApi from './common';
import Layout from './Layout/Layout';
import LayoutAdmin from './Layout/LayoutAdmin';
import socket from './Socket/Socket';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const dispatch = useDispatch();
  const [loadingUser, setLoadingUser] = useState(true);

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
