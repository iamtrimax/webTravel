import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home/Home'
import App from '../App'
import Booking from '../pages/Booking/Booking'
import MyTickets from '../pages/MyTickets/MyTickets'
import Login from '../pages/Login/Login'
import SignUp from '../pages/SignUp/SignUP'

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
        element: <MyTickets />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <SignUp />,
      }
    ]
  }
])
export default Routes