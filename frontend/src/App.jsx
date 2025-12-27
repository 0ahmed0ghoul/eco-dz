import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signin from "./pages/Signin.jsx";
import Contact from "./pages/Contact.jsx";
import CategoryPlaces from "./pages/CategoryPlaces.jsx";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Destination from "./pages/Destination.jsx";
import Places from "./pages/Places.jsx";
import CompleteProfile from "./pages/CompleteProfile.jsx";
import UserProfile from "./pages/UserProfile.jsx";
function App() {
  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signin />} />
      <Route path="/contact" element={<Contact />} />
      {/* <Route path="/travels" element={<Travels />} /> */}
      <Route path="/places" element={<Places />} />
      <Route path="/places/:category" element={<CategoryPlaces />} />
      <Route path="/places/:category/:slug" element={<Destination />} />

      <Route path="/user/complete-profile" element={<CompleteProfile />}/>
      <Route path="/user/profile" element={<UserProfile />}/>


    </Routes>
    <Footer />
    </>
  );
}

export default App;
