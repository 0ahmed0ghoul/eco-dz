import Navbar from './components/Navbar.jsx'
import Intro from './sections/Intro.jsx'
import Map from './sections/Map.jsx'
import Travels from './sections/Travels.jsx'
import Contact from './sections/Contact.jsx'
import Footer from './components/Footer.jsx'
import './styles/App.css'
import Login from './sections/Login.jsx'
import Signin from './sections/Signin.jsx'
import { Routes, Route, BrowserRouter } from "react-router-dom";

function App() {
  return (
    
      <div className="App">
        <Navbar />
        
        <Routes>
        
          <Route path="/" element={
            <>
              <section><Intro /></section>
              <section><Map /></section>
              <section><Travels /></section>
            </>
          } />
          
        
          <Route path="/login" element={<Login />} />
          
          
          <Route path="/signup" element={<Signin />} />
          
          
          <Route path="/contact" element={<Contact />} />
        </Routes>
        
        <Footer />
      </div>
    
  )
}

export default App