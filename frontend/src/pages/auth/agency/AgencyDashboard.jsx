import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Tag,
  Star,
  Building2,
  Phone,
  Globe,
  Edit,
  Plus,
  LogOut,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import HighlightsCard from "./cards/HighlightsCard";
import TripsCard from "./cards/TripsCard";
import DealsCard from "./cards/DealsCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// API Service Layer
const useApiService = () => {
  const token = localStorage.getItem("authToken");

  const fetchData = async (endpoint) => {
    console.log(token);
    const response = await fetch(
      `http://localhost:5000/api/agency/${endpoint}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  };

  const deleteData = async (type, id) => {

    const response = await fetch(
      `http://localhost:5000/api/agency/${type}/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return true;
  };

  return useMemo(() => ({ fetchData, deleteData }), [token]);
};

// Enhanced Dashboard Stats Component with emerald accent
const DashboardStats = ({ trips, deals, highlights }) => {
  const stats = [
    {
      title: "Total Trips",
      value: trips.length,
      icon: MapPin,
      description: `${trips.filter((t) => t.approved === 1).length} approved`,
      gradient: "from-emerald-50 to-white",
      borderColor: "border-emerald-100",
    },
    {
      title: "Active Deals",
      value: deals.length,
      icon: Tag,
      description: `${
        deals.filter((d) => d.status === "active").length
      } live now`,
      gradient: "from-emerald-50 to-white",
      borderColor: "border-emerald-100",
    },
    {
      title: "Highlights",
      value: highlights.length,
      icon: Star,
      description: "Featured content",
      gradient: "from-emerald-50 to-white",
      borderColor: "border-emerald-100",
    },
    {
      title: "Total Revenue",
      value: 0,
      icon: Building2,
      description: "Estimated total",
      gradient: "from-emerald-50 to-white",
      borderColor: "border-emerald-100",
    },
  ];

  const getApprovalStats = () => {
    const approved = trips.filter(t => t.approved === 1).length;
    const pending = trips.filter(t => t.approved === 0).length;
    const rejected = trips.filter(t => t.approved === -1).length;
    return { approved, pending, rejected };
  };

  const approvalStats = getApprovalStats();

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold mt-2 text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-full">
                  <stat.icon className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Approval Status Mini Cards */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="bg-white border border-green-100 rounded-lg p-3 flex items-center gap-3">
          <div className="bg-green-50 p-2 rounded-full">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Approved</p>
            <p className="text-lg font-semibold text-gray-900">{approvalStats.approved}</p>
          </div>
        </div>
        <div className="bg-white border border-amber-100 rounded-lg p-3 flex items-center gap-3">
          <div className="bg-amber-50 p-2 rounded-full">
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-lg font-semibold text-gray-900">{approvalStats.pending}</p>
          </div>
        </div>
        <div className="bg-white border border-red-100 rounded-lg p-3 flex items-center gap-3">
          <div className="bg-red-50 p-2 rounded-full">
            <XCircle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Rejected</p>
            <p className="text-lg font-semibold text-gray-900">{approvalStats.rejected}</p>
          </div>
        </div>
      </div>
    </>
  );
};

// Enhanced Loading Skeleton
const DashboardSkeleton = () => (
  <div className="space-y-8">
    <div className="flex justify-between items-center">
      <div>
        <Skeleton className="h-10 w-56 bg-gray-200" />
        <Skeleton className="h-4 w-72 mt-3 bg-gray-200" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 w-32 bg-gray-200" />
        <Skeleton className="h-10 w-32 bg-gray-200" />
      </div>
    </div>
    <DashboardStatsSkeleton />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Skeleton className="h-96 bg-gray-200 rounded-xl" />
      <Skeleton className="h-96 bg-gray-200 rounded-xl" />
    </div>
  </div>
);

const DashboardStatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {[...Array(4)].map((_, i) => (
      <Skeleton key={i} className="h-32 bg-gray-200 rounded-lg" />
    ))}
  </div>
);

// Main Dashboard Component
const AgencyDashboard = () => {
  const [agency, setAgency] = useState(null);
  const [trips, setTrips] = useState([]);
  const [deals, setDeals] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    type: "",
    id: null,
    title: "",
  });

  const apiService = useApiService();

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [tripsData, dealsData, highlightsData, profileData] =
        await Promise.all([
          apiService.fetchData("trips"),
          apiService.fetchData("deals"),
          apiService.fetchData("highlights"),
          apiService.fetchData("profile"),
        ]);

      setTrips(tripsData.trips || []);
      setAgency(profileData.agency || null);
      setDeals(dealsData.deals || []);
      setHighlights(highlightsData.highlights || []);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleDeleteClick = (type, id, title) => {
    setDeleteDialog({
      isOpen: true,
      type,
      id,
      title,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await apiService.deleteData(deleteDialog.type, deleteDialog.id);
      fetchDashboard(); // Refresh data
    } catch (err) {
      setError("Failed to delete item. Please try again.");
    } finally {
      setDeleteDialog({ isOpen: false, type: "", id: null, title: "" });
    }
  };

  const getApprovalStatus = (status) => {
    const config = {
      1: { label: "Approved", variant: "success" },
      0: { label: "Pending", variant: "warning" },
      [-1]: { label: "Rejected", variant: "destructive" },
    };
    return config[status] || { label: "Unknown", variant: "secondary" };
  };

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardContent className="pt-6 text-center p-8">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-red-500 text-2xl">⚠️</div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              Error Loading Dashboard
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button 
              onClick={fetchDashboard}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <header className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={
                    agency.avatar
                      ? `http://localhost:5000/uploads/avatars/${agency.avatar}`
                      : "/default-avatar.png"
                  }
                  alt="Logo"
                  className="h-20 w-20 rounded-xl object-cover border-4 border-white shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-6 h-6 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Agency Dashboard
                </h1>
                <p className="text-gray-600 mt-2 flex items-center gap-2">
                  Welcome back,{" "}
                  <span className="font-semibold text-emerald-600">
                    {agency?.name}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => navigate("/agency/trips/create")}
                  className="border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Trip
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate("/agency/deals/create")}
                  className="border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Deal
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate("/agency/highlights/create")}
                  className="border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Highlight
                </Button>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  className="border-gray-200 hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button
                  onClick={() => {
                    localStorage.removeItem("authToken");
                    navigate("/login");
                  }}
                  className="gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Section */}
        <DashboardStats trips={trips} deals={deals} highlights={highlights} />

        {/* Enhanced Tab Navigation */}
        <div className="bg-white rounded-xl border border-gray-100 p-1 shadow-sm">
          <div className="flex gap-1">
            {[
              { key: "profile", label: "Agency Profile", icon: Building2 },
              { key: "trips", label: "Trips", icon: MapPin },
              { key: "deals", label: "Deals", icon: Tag },
              { key: "highlights", label: "Highlights", icon: Star },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex-1 justify-center
                  ${
                    activeTab === tab.key
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "profile" && (
            <Card className=" mx-auto border border-gray-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-linear-to-r from-emerald-50 to-white border-b border-emerald-100">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Building2 className="h-6 w-6 text-emerald-600" />
                  Agency Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {agency ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="bg-white border border-gray-100 rounded-xl p-4">
                          <p className="text-sm font-medium text-gray-500 mb-2">Name</p>
                          <p className="font-semibold text-lg text-gray-900">{agency.name}</p>
                        </div>
                        
                        <div className="bg-white border border-gray-100 rounded-xl p-4">
                          <p className="text-sm font-medium text-gray-500 mb-2">Website</p>
                          <a
                            href={agency.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
                          >
                            {agency.website}
                          </a>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-white border border-gray-100 rounded-xl p-4">
                          <p className="text-sm font-medium text-gray-500 mb-2">Contact</p>
                          <div className="space-y-3">
                            <p className="flex items-center gap-2 text-gray-900">
                              <Globe className="h-4 w-4 text-gray-400" />
                              {agency.email}
                            </p>
                            <p className="flex items-center gap-2 text-gray-900">
                              <Phone className="h-4 w-4 text-gray-400" />
                              {agency.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white border border-gray-100 rounded-xl p-6">
                      <p className="text-sm font-medium text-gray-500 mb-3">Description</p>
                      <p className="text-gray-700 leading-relaxed">{agency.description}</p>
                    </div>
                    
                    <Button 
                      variant="outline"
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No agency data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "trips" && (
            <TripsCard trips={trips} onDelete={handleDeleteClick} />
          )}

          {activeTab === "deals" && (
            <DealsCard deals={deals} onDelete={handleDeleteClick} />
          )}

          {activeTab === "highlights" && (
            <HighlightsCard
              highlights={highlights}
              onDelete={handleDeleteClick}
            />
          )}
        </div>
      </div>

      {/* Enhanced Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
      >
        <AlertDialogContent className="border-0 shadow-xl">
          <AlertDialogHeader>
            <div className="bg-red-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-red-600 text-xl">⚠️</div>
            </div>
            <AlertDialogTitle className="text-center text-gray-900">
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-600">
              Are you sure you want to delete <span className="font-semibold text-gray-900">"{deleteDialog.title}"</span>? 
              <br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-3">
            <AlertDialogCancel className="flex-1 border-gray-300 hover:bg-gray-50 text-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AgencyDashboard;