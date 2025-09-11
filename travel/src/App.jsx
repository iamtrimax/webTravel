import Footer from './componets/Footer/Footer'
import Header from './componets/Header/Header'
import { Outlet, useNavigate } from 'react-router-dom'
import Context from './Context/Context';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './Store/userSlice';
function App() {

  const navigator = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);
  const onAuthClick = (path) => {
    navigator(path);
  }
  const onLogOut = async() => {
    const res = await fetch("http://localhost:3000/api/logout", {
      method: "post",
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
      const res = await fetch("http://localhost:3000/api/userdetails", {
        method: "GET",
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

          <Header onAuthClick={onAuthClick} user={user} onLogout={onLogOut} />
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
