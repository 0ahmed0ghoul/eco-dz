import { useState } from "react";
import Navbar from "../components/navbar_footer/Navbar.jsx";
import Footer from "../components/navbar_footer/Footer.jsx";
import Logo from "./Logo.jsx";
import "../styles/Logo.css";
import Hero from "./Hero.jsx";

export default function Home() {
  const [logoDone, setLogoDone] = useState(false);

  return (
    <>
      {!logoDone && <Logo onComplete={() => setLogoDone(true)} />}
      {logoDone && (
        <div className="site-content">
          <section className="section-container ">
            <Hero />
          </section>
          
        </div>
      )}
    </>
  );
}
