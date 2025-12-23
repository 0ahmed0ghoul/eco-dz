import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Logo from "../sections/Logo.jsx";
import "../styles/Logo.css";
import Hero from "../pages/Hero.jsx";

export default function Home() {
  const [logoDone, setLogoDone] = useState(false);

  return (
    <>
      {!logoDone && <Logo onComplete={() => setLogoDone(true)} />}
      {logoDone && (
        <div className="site-content">
          <Navbar />
          <section className="section-container ">
            <Hero />
          </section>
          <Footer />
        </div>
      )}
    </>
  );
}
