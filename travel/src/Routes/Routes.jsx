import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home/Home'
import App from '../App'

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      }
    ]
  }
])
export default Routes