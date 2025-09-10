import Footer from './componets/Footer/Footer'
import Header from './componets/Header/Header'
import { Outlet, useNavigate } from 'react-router-dom'
function App() {

  const navigator = useNavigate();

  const onAuthClick = (path) => {
    navigator(path);
  }
  return (
    <>
      <div className='flex flex-col min-h-screen'>

        <Header onAuthClick={onAuthClick} />
        <main className='main'>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App
