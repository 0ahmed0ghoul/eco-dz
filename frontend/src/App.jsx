import { Routes, Route } from "react-router-dom";
import Home from "./sections/Home.jsx";
import Login from "./sections/Login.jsx";
import Signin from "./sections/Signin.jsx";
import Contact from "./pages/Contact.jsx";
import CategoryPlaces from "./pages/CategoryPlaces.jsx";

import Travels from "./components/Places.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Destination from "./components/Destination.jsx";
import Trip from "./components/Trip.jsx";
import Places from "./components/Places.jsx";

function App() {
  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/contact" element={<Contact />} />
      {/* <Route path="/travels" element={<Travels />} /> */}
      <Route path="/places" element={<Places />} />
      <Route path="/places/:category" element={<CategoryPlaces />} />
      <Route path="/places/:category/:slug" element={<Destination />} />


    </Routes>
    <Footer />
    </>
  );
}

export default App;
