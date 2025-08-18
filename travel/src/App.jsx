import './App.css'
import Footer from './componets/Footer/Footer'
import Header from './componets/Header/Header'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <>
      <Header />
      <main className='main'>
        <Outlet />
      </main>
      <Footer/>
    </>
  )
}

export default App
