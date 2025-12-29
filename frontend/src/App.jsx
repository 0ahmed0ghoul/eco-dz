import { Routes, Route } from "react-router-dom";
import Home from "./sections/Home.jsx";
import Login from "./sections/Login.jsx";
import Signin from "./sections/Signin.jsx";
import Contact from "./pages/Contact.jsx";
import CategoryPlaces from "./pages/CategoryPlaces.jsx";
import Destinations from "./pages/Destinations.jsx";
import WaysToTravel from "./pages/WaysToTravel.jsx";
import Quiz from "./pages/Quiz.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Destination from "./components/Destination.jsx";
import Trip from "./components/Trip.jsx";
import Places from "./components/Places.jsx";
import Inbox from "./components/Inbox.jsx";
import SupportChat from "./components/SupportChat.jsx";

function App() {
  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/travels" element={<WaysToTravel />} />
      <Route path="/destinations" element={<Destinations />} />
      <Route path="/places" element={<Places />} />
      <Route path="/places/:category" element={<CategoryPlaces />} />
      <Route path="/places/:category/:slug" element={<Destination />} />
      <Route path="/trip/:id" element={<Trip />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/inbox" element={<Inbox />} />
      <Route path="/support" element={<SupportChat />} />
    </Routes>
    <Footer />
    </>
  );
}

export default App;
