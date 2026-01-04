import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/auth/Login.jsx";
import Signin from "./pages/auth/Signin.jsx";
import Contact from "./pages/Contact.jsx";
import CategoryPlaces from "./pages/places/CategoryPlaces.jsx";

import Quiz from "./pages/Quiz.jsx";
import Navbar from "./components/navbar_footer/Navbar.jsx";
import Footer from "./components/navbar_footer/Footer.jsx";
import CompleteProfile from "./pages/auth/CompleteProfile.jsx";
import UserProfile from "./pages/auth/UserProfile.jsx";
import Trip from "./components/trips/Trip.jsx";
import Places from "./pages/places/Places.jsx";
import Place from "./pages/places/Place.jsx";

import Inbox from "./pages/Inbox.jsx";
import SupportChat from "./components/about_us/SupportChat.jsx";
import { useState } from "react";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
// import Destination from "./pages/Place.jsx";
import ProtectedRoute from "./pages/auth/ProtectedRoute.jsx"; // adjust path
import AgencyDashboard from "./pages/auth/agency/AgencyDashboard.jsx";
import Trips from "./pages/Trips.jsx";
import Deals from "./pages/Deals.jsx";
import DealDetails from "./pages/DealDetails.jsx";
import TripDetails from "./pages/TripDetails.jsx";
import CreateDeal from "./pages/auth/agency/create/CreateDeal.jsx";
import CreateHighlight from "./pages/auth/agency/create/CreateHighlight.jsx";
import CreateTrip from "./pages/auth/agency/create/CreateTrip.jsx";
import CompleteAgencyProfile from "./pages/auth/agency/CompleteAgencyProfile.jsx";

function App() {
  const [isAdmin, setIsAdmin] = useState(false); // in-memory state

  return (
    <>
      <Navbar />
      <Routes>
        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            isAdmin ? (
              <Navigate to="/admin/dashboard" />
            ) : (
              <AdminLogin setIsAdmin={setIsAdmin} />
            )
          }
        />
        <Route
          path="/admin/dashboard"
          element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin" />}
        />
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signin />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/places" element={<Places />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/trips/:id" element={<TripDetails />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/deals/:id" element={<DealDetails />} />
        // Inbox list
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/places/:category" element={<CategoryPlaces />} />
        <Route path="/places/:category/:slug" element={<Place />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/support" element={<SupportChat />} />
        <Route
          path="/trip/:id"
          element={
            <ProtectedRoute>
              <Trip />
            </ProtectedRoute>
          }
        />
        {/* Protected user routes */}
        <Route
          path="/user/complete-profile"
          element={
            <ProtectedRoute>
              <CompleteProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/inbox"
          element={
            <ProtectedRoute>
              <Inbox />
            </ProtectedRoute>
          }
        />
        <Route path="/agency/complete-profile" element={<CompleteAgencyProfile />} />

        <Route path="/agency/dashboard" element={<AgencyDashboard />} />

        <Route path="/agency/trips/create" element={<CreateTrip />} />
        <Route path="/agency/trips/edit/:id" element={<CreateTrip />} />

        <Route path="/agency/deals/create" element={<CreateDeal />} />
        <Route path="/agency/deals/edit/:id" element={<CreateDeal />} />

        <Route path="/agency/highlights/create" element={<CreateHighlight />} />
        <Route path="/agency/highlights/edit/:id" element={<CreateHighlight />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
