import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home/Home'
import App from '../App'
import Booking from '../pages/Booking/Booking'
import MyTicketsModal from '../pages/MyTickets/MyTicketsModal'
import Login from '../pages/Login/Login'
import SignUp from '../pages/SignUp/SignUP'
import AdminDashboard from '../pages/AdminDashboard/AdminDashboard'
import AdminLogin from '../pages/AdminLogin/AdminLogin'
import Page403 from '../pages/page403/page403'
import AdminRoute from './AdminRoute'
import TravelBlog from '../pages/TravelBlog/TravelBlog'
import Contact from '../pages/Contact/Contact'
import TourDetail from '../pages/TourDetail/TourDetail'
import PaymentSuccess from '../pages/PaymentSuccess/PaymentSuccess'
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword'
import ResetPassword from '../pages/ResetPassword/ResetPassword'

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "booking",
        element: <Booking />,
      },
      {
        path: "my-ticket",
        element: <MyTicketsModal />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <SignUp />,
      },
      {
        path: "403",
        element: <Page403 />
      },
      {
        path: "admin/login",
        element: <AdminLogin />,
      },
      {
        path: "admin",
        element: (<AdminRoute><AdminDashboard /></AdminRoute>),
      },
      {
        path:"travel-blog",
        element:<TravelBlog/>
      },
      {
        path:"contact-page",
        element:<Contact/>
      },
      {
        path:"detail/:id",
        element:<TourDetail/>
      },
      {
        path:"payment/success",
        element:<PaymentSuccess/>
      },
      {
        path:"forgot-password",
        element:<ForgotPassword/>
      },
      {
        path:"reset-password",
        element:<ResetPassword/>
      }
    ]
  }
])
export default Routes