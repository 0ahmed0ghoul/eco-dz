import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signin from "./pages/Signin.jsx";
import Contact from "./pages/Contact.jsx";
import CategoryPlaces from "./pages/CategoryPlaces.jsx";

import WaysToTravel from "./pages/WaysToTravel.jsx";
import Quiz from "./pages/Quiz.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import CompleteProfile from "./pages/CompleteProfile.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import Destination from "./pages/Place.jsx";
import Trip from "./components/Trip.jsx";
import Places from "./pages/Places.jsx";
import Place from "./pages/Place.jsx";

import Inbox from "./components/Inbox.jsx";
import SupportChat from "./components/SupportChat.jsx";

function App() {
  return (
    <>
    <Navbar />
    <Routes>
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
