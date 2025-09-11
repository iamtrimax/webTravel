import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import Routes from './Routes/Routes.jsx'
import { Provider } from 'react-redux'
import { store } from './Store/store.jsx'

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <RouterProvider router={Routes}/>
    </Provider>

)
