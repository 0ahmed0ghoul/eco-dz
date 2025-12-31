import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/auth/Login.jsx";
import Signin from "./pages/auth/Signin.jsx";
import Contact from "./pages/Contact.jsx";
import CategoryPlaces from "./pages/places/CategoryPlaces.jsx";

import WaysToTravel from "./pages/WaysToTravel.jsx";
import Quiz from "./pages/Quiz.jsx";
import Navbar from "./components/navbar_footer/Navbar.jsx";
import Footer from "./components/navbar_footer/Footer.jsx";
import CompleteProfile from "./pages/auth/CompleteProfile.jsx";
import UserProfile from "./pages/auth/UserProfile.jsx";
import Trip from "./components/trips/Trip.jsx";
import Places from "./pages/places/Places.jsx";
import Place from "./pages/places/Place.jsx";

import Inbox from "./components/inbox/Inbox.jsx";
import SupportChat from "./components/about_us/SupportChat.jsx";
import { useState } from "react";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
// import Destination from "./pages/Place.jsx";

function App() {
  const [isAdmin, setIsAdmin] = useState(false); // in-memory state

  return (
    <>
    <Navbar />
    <Routes>
        <Route 
          path="/admin" 
          element={isAdmin ? <Navigate to="/admin/dashboard" /> : <AdminLogin setIsAdmin={setIsAdmin} />}
        />
        <Route 
          path="/admin/dashboard" 
          element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin" />}
        />

      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signin />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/travels" element={<WaysToTravel />} />
      <Route path="/places" element={<Places />} />
      <Route path="/places/:category" element={<CategoryPlaces />} />
      <Route path="/places/:category/:slug" element={<Place />} />

      <Route path="/user/complete-profile" element={<CompleteProfile />}/>
      <Route path="/user/profile" element={<UserProfile />}/>
      <Route path="/user/inbox" element={<Inbox />} />

      <Route path="/trip/:id" element={<Trip />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/support" element={<SupportChat />} />
    </Routes>
    <Footer />
    </>
  );
}

export default App;
