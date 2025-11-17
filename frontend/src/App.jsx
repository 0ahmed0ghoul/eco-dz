import Navbar from './components/Navbar.jsx'
import Intro from './sections/Intro.jsx'
import Map from './sections/Map.jsx'
import Travels from './sections/Travels.jsx'
import Contact from './sections/Contact.jsx'

import './styles/App.css'
function App() {

  return (
    <>
      <Navbar></Navbar>
      <section ><Intro/></section>
      <section ><Map /></section>
      <section ><Travels /></section>
      <section ><Contact /></section>
      <footer></footer>
    </>
  )
}

export default App
