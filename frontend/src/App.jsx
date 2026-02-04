import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/auth/Login.jsx";
import Signin from "./pages/auth/Signin.jsx";
import Contact from "./pages/Contact.jsx";
import CategoryPlaces from "./pages/places/CategoryPlaces.jsx";
import Quiz from "./pages/Quiz.jsx";
import Navbar from "./components/navbar_footer/Navbar.jsx";
import Footer from "./components/navbar_footer/Footer.jsx";
import CompleteProfile from "./pages/auth/traveller/CompleteProfile.jsx";
import UserProfile from "./pages/auth/traveller/UserProfile.jsx";
import Trip from "./components/trips/Trip.jsx";
import Places from "./pages/places/Places.jsx";
import Place from "./pages/places/Place.jsx";
import Inbox from "./pages/Inbox.jsx";
import SupportChat from "./components/about_us/SupportChat.jsx";
import { useState } from "react";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ProtectedRoute from "./pages/auth/ProtectedRoute.jsx";
import AgencyDashboard from "./pages/auth/agency/AgencyDashboard.jsx";
import Trips from "./pages/Trips.jsx";
import Deals from "./pages/Deals.jsx";
import DealDetails from "./pages/DealDetails.jsx";
import TripDetails from "./pages/TripDetails.jsx";
import CreateDeal from "./pages/auth/agency/create/CreateDeal.jsx";
import CreateHighlight from "./pages/auth/agency/create/CreateHighlight.jsx";
import CreateTrip from "./pages/auth/agency/create/CreateTrip.jsx";
import CompleteAgencyProfile from "./pages/auth/agency/CompleteAgencyProfile.jsx";
import { SocketProvider } from './contexts/SocketContext';
import TravelAgency from "./pages/TravelAgency.jsx";
import CampaignQuestions from "./pages/CampaignQuestions.jsx";
import { UserProvider } from "./contexts/UserContext";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  
  // Check if current route is /inbox
  const isInboxPage = location.pathname === '/inbox';

  return (
    <SocketProvider>
       <UserProvider>
      <div className="App">
        <Navbar />
        <main className={`${isInboxPage ? 'h-[calc(100vh-64px)] overflow-hidden' : ''}`}>
          <Routes>
            {/* 1️⃣ Admin login page */}
            <Route
              path="/admin"
              element={
                isAdmin ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : (
                  <AdminLogin setIsAdmin={setIsAdmin} />
                )
              }
            />

            {/* 2️⃣ Protected admin dashboard */}
            <Route
              path="/admin/dashboard"
              element={
                isAdmin ? <AdminDashboard /> : <Navigate to="/admin" replace />
              }
            />

            {/* ===== PUBLIC ROUTES ===== */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signin />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/places" element={<Places />} />
            <Route path="/places/:category" element={<CategoryPlaces />} />
            <Route path="/places/:category/:slug" element={<Place />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/trips/:id" element={<TripDetails />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/deals/:id" element={<DealDetails />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/agency/:id" element={<TravelAgency />} />
            <Route path="/campaign/questions" element={<CampaignQuestions />} />

            {/* ===== USER PROTECTED ===== */}
            <Route
              path="/inbox"
              element={
                <ProtectedRoute>
                  <Inbox />
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
              path="/user/complete-profile"
              element={
                <ProtectedRoute>
                  <CompleteProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/trip/:id"
              element={
                <ProtectedRoute>
                  <Trip />
                </ProtectedRoute>
              }
            />

            <Route
              path="/support"
              element={
                <ProtectedRoute>
                  <SupportChat />
                </ProtectedRoute>
              }
            />

            {/* ===== AGENCY PROTECTED ===== */}
            <Route
              path="/agency/complete-profile"
              element={
                <ProtectedRoute role="agency">
                  <CompleteAgencyProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/agency/dashboard"
              element={
                <ProtectedRoute role="agency">
                  <AgencyDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/agency/trips/create"
              element={
                <ProtectedRoute role="agency">
                  <CreateTrip />
                </ProtectedRoute>
              }
            />

            <Route
              path="/agency/trips/edit/:id"
              element={
                <ProtectedRoute role="agency">
                  <CreateTrip />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agency/deals/create"
              element={
                <ProtectedRoute role="agency">
                  <CreateDeal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agency/highlight/create"
              element={
                <ProtectedRoute role="agency">
                  <CreateHighlight />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        
        {/* Only show footer if NOT on /inbox page */}
        {!isInboxPage && <Footer />}
      </div>
      </UserProvider>
    </SocketProvider>
  );
}

export default App;