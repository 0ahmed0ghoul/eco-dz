import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Intro from "./Intro.jsx";
import Map from "./Map.jsx";
import Travels from "./Travels.jsx";
import Contact from "./Contact.jsx";
import Footer from "../components/Footer.jsx";
import Logo from "../sections/Logo.jsx";
import "../styles/Logo.css";

export default function Home() {
  const [logoDone, setLogoDone] = useState(false);

  return (
    <>
      {!logoDone && <Logo onComplete={() => setLogoDone(true)} />}
      {logoDone && (
        <div className="site-content slide-up">
          <Navbar />
          <section className="section-container">
            <Intro />
          </section>
          <section>
            <Map />
          </section>
          <section>
            <Travels />
          </section>
          <section>
            <Contact />
          </section>
          <Footer />
        </div>
      )}
    </>
  );
}
