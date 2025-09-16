import Footer from './componets/Footer/Footer'
import Header from './componets/Header/Header'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Context from './Context/Context';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './Store/userSlice';
import sumaryApi from './common';
function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);
  const onAuthClick = (path) => {
    navigator(path);
  }
  const onLogOut = async () => {
    const res = await fetch(sumaryApi.logout.url, {
      method: sumaryApi.logout.method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JSON.parse(localStorage.getItem("token"))}`
      }
    });
    const data = await res.json();
    if (data.success) {
      localStorage.removeItem("token");
      dispatch(clearUser());
      navigator("/");
    }
  }
  const fetchUserDetails = async () => {
    const token = JSON.parse(localStorage.getItem("token"));

    if (token) {
      // Call API to fetch user details
      const res = await fetch(sumaryApi.getUserDetails.url, {
        method: sumaryApi.getUserDetails.method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        // Handle success logic here
        dispatch(setUser(data.data));
      } else {
        // Handle failure logic here
        console.log(data.message || "Failed to fetch user details");
        return null;
      }
    }
  }

  return (
    <>
      <Context.Provider value={{ fetchUserDetails }}>
        <div className='flex flex-col min-h-screen'>
          {
            !isAdminRoute && (

              <Header onAuthClick={onAuthClick} user={user} onLogout={onLogOut} />
            )
          }
          <main className='main'>
            <Outlet />
          </main>
          <Footer />
        </div>
      </Context.Provider>
    </>
  )
}

export default App
