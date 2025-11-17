import React from 'react'
import '../styles/Navbar.css'
import logo from '../assets/logos/logo.png'  // ✅ Correct import

function Navbar() {
    const isSIgnedIn = true; // Placeholder for user authentication status
    function scrollToSection(id) {
        const section = document.getElementById(id);
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      
  return (
    <nav>
      <img src={logo} alt="Logo" />
  <nav className='nav-links'>
    <a className='link' onClick={() => scrollToSection('maps')}>Map</a>
    <a className='link' onClick={() => scrollToSection('travels')}>Travels</a>
    <a className='link' onClick={() => scrollToSection('contact')}>Contact</a>
  </nav>
  {isSIgnedIn ? (
    <div className='profile-logo' style={{borderRadius:"50%",backgroundColor:"green",width:"60px" ,height:"60px"}}></div>
  ) :
  <a className='link' href='login'>Login</a>
    }
    </nav>
  )
}

export default Navbar
