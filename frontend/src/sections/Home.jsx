import Navbar from "../components/Navbar.jsx";
import Intro from "./Intro.jsx";
import Map from "./Map.jsx";
import Travels from "./Travels.jsx";
import Contact from "./Contact.jsx";
import Footer from "../components/Footer.jsx";

export default function Home() {
  return (
    <>
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
    </>
  );
}
