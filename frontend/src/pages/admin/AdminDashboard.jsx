import { useState, useEffect } from "react";
import {
  FaPlus,
  FaTrash,
  FaCheck,
  FaTimes,
  FaMapMarkerAlt,
  FaTag,
  FaBuilding,
  FaCalendarCheck,
  FaSearch,
  FaEdit,
  FaEye,
  FaDatabase,
  FaUsers,
  FaRoute,
  FaCity,
  FaUserTie,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [places, setPlaces] = useState([]);
  const [ptrips, setPtrips] = useState([]);
  const [atrips, setAtrips] = useState([]);
  const [users, setUsers] = useState([]);
  const [porganizers, setPorganizers] = useState([]);
  const [aorganizers, setAorganizers] = useState([]);
  const [newPlace, setNewPlace] = useState({
    name: "",
    location: "",
    category: "",
    description: "",
  });
  const [loading, setLoading] = useState({
    places: false,
    trips: false,
    users: false,
    organizers: false,
  });
  const [activeTab, setActiveTab] = useState("places");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch functions
  const fetchPlaces = async () => {
    setLoading((prev) => ({ ...prev, places: true }));
    try {
      const res = await fetch("http://localhost:5000/api/admin/places");
      const data = await res.json();
      setPlaces(data.places || []);
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setLoading((prev) => ({ ...prev, places: false }));
    }
  };

  const fetchUsers = async () => {
    setLoading((prev) => ({ ...prev, users: true }));
    try {
      const res = await fetch("http://localhost:5000/api/admin/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  };

  const fetchOrganizers = async () => {
    setLoading((prev) => ({ ...prev, organizers: true }));
    try {
      const res = await fetch("http://localhost:5000/api/admin/organizers");
      const data = await res.json();

      const approvedOrganizers = (data.organizers || []).filter(
        (org) => org.approved === 1
      );
      const pendingOrganizers = (data.organizers || []).filter(
        (org) => org.approved === 0
      );

      setAorganizers(approvedOrganizers);
      setPorganizers(pendingOrganizers);
    } catch (error) {
      console.error("Error fetching organizers:", error);
    } finally {
      setLoading((prev) => ({ ...prev, organizers: false }));
    }
  };

  const fetchTrips = async () => {
    setLoading((prev) => ({ ...prev, trips: true }));
    try {
      const res = await fetch("http://localhost:5000/api/admin/trips");
      const data = await res.json();

      const approvedTrips = (data.trips || []).filter(
        (trip) => trip.approved === 1
      );
      const pendingTrips = (data.trips || []).filter(
        (trip) => trip.approved === 0
      );

      setAtrips(approvedTrips);
      setPtrips(pendingTrips);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading((prev) => ({ ...prev, trips: false }));
    }
  };

  useEffect(() => {
    fetchPlaces();
    fetchTrips();
    fetchUsers();
    fetchOrganizers();
  }, []);

  const filteredPlaces = places.filter(
    (place) =>
      place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalPlaces: places.length,
    pendingTrips: ptrips.length,
    activeTrips: atrips.length,
    totalUsers: users.length,
    pendingOrganizers: porganizers.length,
    activeOrganizers: aorganizers.length,
  };

  // Handlers for adding, deleting, approving, rejecting
  const handleAddPlace = async () => {
    if (!newPlace.name || !newPlace.location || !newPlace.category) {
      alert("Please fill all required fields");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/admin/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlace),
      });
      if (res.ok) {
        setNewPlace({ name: "", location: "", category: "", description: "" });
        fetchPlaces();
        alert("Place added successfully!");
      }
    } catch (error) {
      console.error(error);
      alert("Error adding place");
    }
  };

  const handleDeletePlace = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/places/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchPlaces();
        alert("Place deleted successfully!");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting place");
    }
  };

  const handleApproveTrip = async (id, title) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/trips/approve/${id}`,
        { method: "POST" }
      );
      if (res.ok) {
        alert(`Trip "${title}" approved successfully!`);
        fetchTrips();
      }
    } catch (error) {
      console.error(error);
      alert("Error approving trip");
    }
  };

  const handleRejectTrip = async (id, title) => {
    if (!window.confirm(`Reject trip "${title}"?`)) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/trips/reject/${id}`,
        { method: "POST" }
      );
      if (res.ok) {
        alert(`Trip "${title}" rejected!`);
        fetchTrips();
      }
    } catch (error) {
      console.error(error);
      alert("Error rejecting trip");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FaDatabase className="text-blue-600 text-2xl" />
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search places..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => {
              fetchPlaces();
              fetchTrips();
              fetchUsers();
              fetchOrganizers();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh Data
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <FaCity className="text-blue-600 text-2xl mb-2" />
          <p className="text-gray-600 text-sm">Total Places</p>
          <p className="font-bold text-lg">{stats.totalPlaces}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <FaCalendarCheck className="text-amber-600 text-2xl mb-2" />
          <p className="text-gray-600 text-sm">Pending Trips</p>
          <p className="font-bold text-lg">{stats.pendingTrips}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <FaRoute className="text-emerald-600 text-2xl mb-2" />
          <p className="text-gray-600 text-sm">Approved Trips</p>
          <p className="font-bold text-lg">{stats.activeTrips}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <FaUsers className="text-purple-600 text-2xl mb-2" />
          <p className="text-gray-600 text-sm">Users</p>
          <p className="font-bold text-lg">{stats.totalUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <FaUserTie className="text-yellow-600 text-2xl mb-2" />
          <p className="text-gray-600 text-sm">Pending Organizers</p>
          <p className="font-bold text-lg">{stats.pendingOrganizers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <FaUserTie className="text-green-600 text-2xl mb-2" />
          <p className="text-gray-600 text-sm">Approved Organizers</p>
          <p className="font-bold text-lg">{stats.activeOrganizers}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-2 mb-4">
          {[
            { id: "places", label: `Places (${places.length})` },
            { id: "ptrips", label: `Pending Trips (${ptrips.length})` },
            { id: "atrips", label: `Approved Trips (${atrips.length})` },
            { id: "porganizers", label: `Pending Organizers (${porganizers.length})` },
            { id: "aorganizers", label: `Approved Organizers (${aorganizers.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-lg ${
                activeTab === tab.id
                  ? "bg-blue-100 text-blue-700"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          {/* Render each tab content */}
          {activeTab === "places" &&
            (loading.places ? (
              <p>Loading places...</p>
            ) : (
              filteredPlaces.map((place) => (
                <div key={place.id} className="p-2 border-b flex justify-between">
                  <div>
                    <p className="font-bold">{place.name}</p>
                    <p className="text-gray-500">{place.location}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleDeletePlace(place.id, place.name)}>
                      <FaTrash />
                    </button>
                    <button>
                      <FaEdit />
                    </button>
                    <button>
                      <FaEye />
                    </button>
                  </div>
                </div>
              ))
            ))}

          {activeTab === "ptrips" &&
            (loading.trips ? (
              <p>Loading pending trips...</p>
            ) : (
              ptrips.map((trip) => (
                <div key={trip.id} className="p-2 border-b flex justify-between">
                  <div>
                    <p className="font-bold">{trip.title}</p>
                    <p className="text-gray-500">Agency: {trip.agency_name}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleApproveTrip(trip.id, trip.title)}>
                      <FaCheck />
                    </button>
                    <button onClick={() => handleRejectTrip(trip.id, trip.title)}>
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ))
            ))}

          {activeTab === "atrips" &&
            (loading.trips ? (
              <p>Loading approved trips...</p>
            ) : (
              atrips.map((trip) => (
                <div key={trip.id} className="p-2 border-b flex justify-between">
                  <div>
                    <p className="font-bold">{trip.title}</p>
                    <p className="text-gray-500">Agency: {trip.agency_name}</p>
                  </div>
                </div>
              ))
            ))}

          {activeTab === "porganizers" &&
            (loading.organizers ? (
              <p>Loading pending organizers...</p>
            ) : (
              porganizers.map((org) => (
                <div key={org.id} className="p-2 border-b flex justify-between">
                  <div>
                    <p className="font-bold">{org.name}</p>
                    <p className="text-gray-500">{org.email}</p>
                  </div>
                </div>
              ))
            ))}

          {activeTab === "aorganizers" &&
            (loading.organizers ? (
              <p>Loading approved organizers...</p>
            ) : (
              aorganizers.map((org) => (
                <div key={org.id} className="p-2 border-b flex justify-between">
                  <div>
                    <p className="font-bold">{org.name}</p>
                    <p className="text-gray-500">{org.email}</p>
                  </div>
                </div>
              ))
            ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
