import Footer from './componets/Footer/Footer'
import Header from './componets/Header/Header'
import { Outlet } from 'react-router-dom'
function App() {

  return (
    <>
      <div className='flex flex-col min-h-screen'>

        <Header />
        <main className='main'>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App
