import { Routes, Route } from "react-router-dom";
import Home from "./sections/Home.jsx";
import Login from "./sections/Login.jsx";
import Signin from "./sections/Signin.jsx";
import Contact from "./pages/Contact.jsx";
import Travels from "./pages/Travels.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Destination from "./components/Destination.jsx";
import Trip from "./components/Trip.jsx";

function App() {
  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/travels" element={<Travels />} />
      <Route path="/place/0" element={<Destination />} />
      <Route path="/trip/0" element={<Trip />} />
    </Routes>
    <Footer />
    </>
  );
}

export default App;
