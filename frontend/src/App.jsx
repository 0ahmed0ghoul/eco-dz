import Navbar from './components/Navbar.jsx'
import Intro from './sections/Intro.jsx'
import Map from './sections/Map.jsx'
import Travels from './sections/Travels.jsx'
import Contact from './sections/Contact.jsx'
import Footer from './components/Footer.jsx'
import './styles/App.css'
import Login from './sections/Login.jsx'
import Signin from './sections/Signin.jsx'
function App() {

  return (
    <>
      <Navbar></Navbar>
      <section className='section-container' ><Intro/></section>
      <section ><Map /></section>
      <section ><Travels /></section>
      <section ><Contact /></section>
      <section ><Login /></section>
      <section ><Signin /></section>
      <Footer></Footer>
    </>
  )
}

export default App
