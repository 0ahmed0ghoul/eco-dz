import { useState, useEffect, useMemo } from "react";
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
  FaChevronDown,
  FaChevronUp,
  FaFilter,
  FaSort,
  FaExternalLinkAlt,
  FaChartLine,
  FaBell,
  FaUserCircle,
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
  const [showAddPlaceForm, setShowAddPlaceForm] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedItems, setSelectedItems] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New trip pending approval", type: "warning", time: "5 min ago" },
    { id: 2, text: "Organizer registration approved", type: "success", time: "1 hour ago" },
  ]);

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
        (org) => org.verified === 1
      );
      const pendingOrganizers = (data.organizers || []).filter(
        (org) => org.verified === 0
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

  const filteredPlaces = useMemo(() => {
    return places.filter(
      (place) =>
        place.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [places, searchTerm]);

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
        setShowAddPlaceForm(false);
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
        `http://localhost:5000/api/admin/trips/${id}/approve`,
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
        `http://localhost:5000/api/admin/trips/${id}/reject`,
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

  const handleApproveOrganizer = async (id, name) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/organizers/${id}/approve`,
        { method: "POST" }
      );
  
      if (res.ok) {
        alert(`Organizer "${name}" approved successfully!`);
        fetchOrganizers();
      }
    } catch (error) {
      console.error(error);
      alert("Error approving organizer");
    }
  };
  
  const handleRejectOrganizer = async (id, name) => {
    if (!window.confirm(`Reject organizer "${name}"?`)) return;
  
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/organizers/${id}/reject`,
        { method: "POST" }
      );
  
      if (res.ok) {
        alert(`Organizer "${name}" rejected!`);
        fetchOrganizers();
      }
    } catch (error) {
      console.error(error);
      alert("Error rejecting organizer");
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = (data) => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const tabs = [
    { id: "places", label: `Places`, count: places.length, icon: FaCity },
    { id: "ptrips", label: `Pending Trips`, count: ptrips.length, icon: FaCalendarCheck },
    { id: "atrips", label: `Approved Trips`, count: atrips.length, icon: FaRoute },
    { id: "porganizers", label: `Pending Org.`, count: porganizers.length, icon: FaUserTie },
    { id: "aorganizers", label: `Approved Org.`, count: aorganizers.length, icon: FaUserTie },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto my-2 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white/10 rounded-xl">
              <FaDatabase className="text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-blue-100 text-sm">Manage your travel platform</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="p-2 hover:bg-white/10 rounded-full relative">
                <FaBell className="text-xl" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>
            
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search anything..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition">
              <FaUserCircle className="text-xl" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-6 py-6 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            { label: "Total Places", value: stats.totalPlaces, icon: FaCity, color: "from-blue-500 to-blue-600", change: "+12%" },
            { label: "Pending Trips", value: stats.pendingTrips, icon: FaCalendarCheck, color: "from-amber-500 to-amber-600", change: "+5" },
            { label: "Active Trips", value: stats.activeTrips, icon: FaRoute, color: "from-emerald-500 to-emerald-600", change: "+8%" },
            { label: "Total Users", value: stats.totalUsers, icon: FaUsers, color: "from-purple-500 to-purple-600", change: "+23%" },
            { label: "Pending Organizers", value: stats.pendingOrganizers, icon: FaUserTie, color: "from-yellow-500 to-yellow-600", change: "+3" },
            { label: "Active Organizers", value: stats.activeOrganizers, icon: FaUserTie, color: "from-green-500 to-green-600", change: "+15%" },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <FaChartLine className="text-green-500" />
                    <span className="text-green-600">{stat.change}</span> from last month
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="text-white text-2xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-8">
        {/* Quick Actions Bar */}
        <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddPlaceForm(!showAddPlaceForm)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2"
            >
              <FaPlus /> Add New Place
            </button>
            <button
              onClick={() => {
                fetchPlaces();
                fetchTrips();
                fetchUsers();
                fetchOrganizers();
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
            >
              <FaDatabase /> Refresh All
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Add Place Form */}
        {showAddPlaceForm && (
          <div className="mb-6 p-6 bg-white rounded-xl shadow-lg border border-blue-100 animate-fadeIn">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaPlus className="text-blue-600" /> Add New Place
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Place Name *"
                value={newPlace.name}
                onChange={(e) => setNewPlace({...newPlace, name: e.target.value})}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Location *"
                value={newPlace.location}
                onChange={(e) => setNewPlace({...newPlace, location: e.target.value})}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Category *"
                value={newPlace.category}
                onChange={(e) => setNewPlace({...newPlace, category: e.target.value})}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <textarea
                placeholder="Description"
                value={newPlace.description}
                onChange={(e) => setNewPlace({...newPlace, description: e.target.value})}
                rows="2"
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowAddPlaceForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPlace}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition"
              >
                Add Place
              </button>
            </div>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 shadow-inner"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <tab.icon className={activeTab === tab.id ? "text-blue-600" : "text-gray-400"} />
              <span className="font-medium">{tab.label}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                activeTab === tab.id 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-600"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {activeTab === "places" && "Places Management"}
                {activeTab === "ptrips" && "Pending Trips Approval"}
                {activeTab === "atrips" && "Active Trips"}
                {activeTab === "porganizers" && "Pending Organizer Verification"}
                {activeTab === "aorganizers" && "Verified Organizers"}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {activeTab === "places" && "Manage tourist destinations and attractions"}
                {activeTab === "ptrips" && "Review and approve trip submissions"}
                {activeTab === "atrips" && "Monitor active trips and packages"}
                {activeTab === "porganizers" && "Verify new organizer applications"}
                {activeTab === "aorganizers" && "View all verified trip organizers"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-200 rounded-lg" title="Filter">
                <FaFilter />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-lg" title="Sort">
                <FaSort />
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading[activeTab === "places" ? "places" : 
                   activeTab === "ptrips" || activeTab === "atrips" ? "trips" : 
                   "organizers"] && (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-500">Loading data...</p>
            </div>
          )}

          {/* Content Based on Active Tab */}
          {!loading[activeTab === "places" ? "places" : 
                    activeTab === "ptrips" || activeTab === "atrips" ? "trips" : 
                    "organizers"] && (
            <div className="divide-y divide-gray-100">
              {/* Places Tab */}
              {activeTab === "places" && filteredPlaces.map((place) => (
                <div key={place.id} className="px-6 py-4 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <FaMapMarkerAlt className="text-blue-600 text-xl" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-gray-900">{place.name}</h4>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {place.category}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1 flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gray-400" /> {place.location}
                        </p>
                        <p className="text-gray-500 text-sm mt-2">{place.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDeletePlace(place.id, place.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        title="View on Map"
                      >
                        <FaExternalLinkAlt />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pending Trips Tab */}
              {activeTab === "ptrips" && sortedData(ptrips).map((trip) => (
                <div key={trip.id} className="px-6 py-4 hover:bg-amber-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-amber-50 rounded-lg">
                        <FaCalendarCheck className="text-amber-600 text-xl" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{trip.title}</h4>
                        <div className="flex gap-4 mt-2">
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <FaBuilding className="text-gray-400" /> {trip.agency_name}
                          </p>
                          <p className="text-sm text-gray-600">Duration: {trip.duration || "N/A"} days</p>
                          <p className="text-sm text-gray-600">Price: ${trip.price || "N/A"}</p>
                        </div>
                        <p className="text-amber-600 text-sm mt-2 flex items-center gap-1">
                          <FaBell /> Awaiting approval
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApproveTrip(trip.id, trip.title)}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition flex items-center gap-2"
                      >
                        <FaCheck /> Approve
                      </button>
                      <button
                        onClick={() => handleRejectTrip(trip.id, trip.title)}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition flex items-center gap-2"
                      >
                        <FaTimes /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Approved Trips Tab */}
              {activeTab === "atrips" && sortedData(atrips).map((trip) => (
                <div key={trip.id} className="px-6 py-4 hover:bg-emerald-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-emerald-50 rounded-lg">
                        <FaRoute className="text-emerald-600 text-xl" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-gray-900">{trip.title}</h4>
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                            Active
                          </span>
                        </div>
                        <div className="flex gap-4 mt-2">
                          <p className="text-sm text-gray-600">Agency: {trip.agency_name}</p>
                          <p className="text-sm text-gray-600">⭐ {trip.rating || "No rating"}</p>
                          <p className="text-sm text-gray-600">👥 {trip.bookings || 0} bookings</p>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition">
                      View Details
                    </button>
                  </div>
                </div>
              ))}

              {/* Pending Organizers Tab */}
              {activeTab === "porganizers" && sortedData(porganizers).map((org) => (
                <div key={org.id} className="px-6 py-4 hover:bg-yellow-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <FaUserTie className="text-yellow-600 text-xl" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{org.name}</h4>
                        <div className="flex gap-4 mt-2">
                          <p className="text-sm text-gray-600">📧 {org.email}</p>
                          <p className="text-sm text-gray-600">📞 {org.phone || "N/A"}</p>
                          <p className="text-sm text-gray-600">🏢 {org.company || "Individual"}</p>
                        </div>
                        <p className="text-yellow-600 text-sm mt-2 flex items-center gap-1">
                          <FaBell /> Verification pending
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApproveOrganizer(org.id, org.name)}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition flex items-center gap-2"
                      >
                        <FaCheck /> Approve
                      </button>
                      <button
                        onClick={() => handleRejectOrganizer(org.id, org.name)}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition flex items-center gap-2"
                      >
                        <FaTimes /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Approved Organizers Tab */}
              {activeTab === "aorganizers" && sortedData(aorganizers).map((org) => (
                <div key={org.id} className="px-6 py-4 hover:bg-green-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <FaUserTie className="text-green-600 text-xl" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-gray-900">{org.name}</h4>
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            Verified
                          </span>
                        </div>
                        <div className="flex gap-4 mt-2">
                          <p className="text-sm text-gray-600">📧 {org.email}</p>
                          <p className="text-sm text-gray-600">📞 {org.phone || "N/A"}</p>
                          <p className="text-sm text-gray-600">
                            Trips created: {org.trips_count || 0}
                          </p>
                        </div>
                        <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                          <FaCheck /> Verified on {new Date(org.verified_at || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading[activeTab === "places" ? "places" : 
                    activeTab === "ptrips" || activeTab === "atrips" ? "trips" : 
                    "organizers"] && 
           (activeTab === "places" && filteredPlaces.length === 0) ||
           (activeTab === "ptrips" && ptrips.length === 0) ||
           (activeTab === "atrips" && atrips.length === 0) ||
           (activeTab === "porganizers" && porganizers.length === 0) ||
           (activeTab === "aorganizers" && aorganizers.length === 0) ? (
            <div className="p-12 text-center">
              <div className="inline-block p-4 bg-gray-100 rounded-full">
                {activeTab === "places" && <FaCity className="text-4xl text-gray-400" />}
                {activeTab === "ptrips" && <FaCalendarCheck className="text-4xl text-gray-400" />}
                {activeTab === "atrips" && <FaRoute className="text-4xl text-gray-400" />}
                {activeTab === "porganizers" && <FaUserTie className="text-4xl text-gray-400" />}
                {activeTab === "aorganizers" && <FaUserTie className="text-4xl text-gray-400" />}
              </div>
              <h4 className="mt-4 text-lg font-medium text-gray-700">No data found</h4>
              <p className="text-gray-500 mt-2">
                {activeTab === "ptrips" || activeTab === "porganizers" 
                  ? "All items have been processed" 
                  : "No items in this category"}
              </p>
            </div>
          ) : null}

          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to <span className="font-medium">
                {activeTab === "places" ? filteredPlaces.length :
                 activeTab === "ptrips" ? ptrips.length :
                 activeTab === "atrips" ? atrips.length :
                 activeTab === "porganizers" ? porganizers.length : aorganizers.length}
              </span> entries
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                1
              </button>
              <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity Sidebar */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaChartLine className="text-blue-600" /> Platform Overview
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span>Total Bookings This Month</span>
                <span className="font-bold">1,234</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span>Revenue Generated</span>
                <span className="font-bold">$45,678</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span>New Users This Week</span>
                <span className="font-bold">89</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaBell className="text-amber-600" /> Recent Notifications
            </h3>
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div key={notif.id} className={`p-3 rounded-lg border-l-4 ${
                  notif.type === 'warning' ? 'border-l-amber-500 bg-amber-50' :
                  notif.type === 'success' ? 'border-l-green-500 bg-green-50' :
                  'border-l-blue-500 bg-blue-50'
                }`}>
                  <p className="text-sm">{notif.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;