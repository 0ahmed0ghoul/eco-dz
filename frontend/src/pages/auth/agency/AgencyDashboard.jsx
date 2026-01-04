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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import HighlightsCard from "./HighlightsCard";
import TripsCard from "./TripsCard";
import DealsCard from "./DealsCard";
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
    console.log(endpoint);
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

// Dashboard Stats Component
const DashboardStats = ({ trips, deals, highlights }) => {
  const stats = [
    {
      title: "Total Trips",
      value: trips.length,
      icon: MapPin,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: `${trips.filter((t) => t.approved === 1).length} approved`,
    },
    {
      title: "Active Deals",
      value: deals.length,
      icon: Tag,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: `${
        deals.filter((d) => d.status === "active").length
      } live now`,
    },
    {
      title: "Highlights",
      value: highlights.length,
      icon: Star,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Featured content",
    },
    {
      title: "Total Revenue",
      value: `$${trips
        .reduce((sum, trip) => sum + (trip.price || 0), 0)
        .toLocaleString()}`,
      icon: Building2,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      description: "Estimated total",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-full`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Loading Skeleton Component
const DashboardSkeleton = () => (
  <div className="space-y-8">
    <div className="flex justify-between items-center">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
    <DashboardStatsSkeleton />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Skeleton className="h-96" />
      <Skeleton className="h-96" />
    </div>
  </div>
);

const DashboardStatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {[...Array(4)].map((_, i) => (
      <Skeleton key={i} className="h-32" />
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
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    type: "",
    id: null,
    title: "",
  });
  const [createType, setCreateType] = useState(null);
  // "trip" | "deal" | "highlight" | null

  const apiService = useApiService();

  // Memoized data fetcher
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
  console.log(agency.logo);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-red-500 mb-4">⚠️</div>
            <h3 className="text-lg font-semibold mb-2">
              Error Loading Dashboard
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchDashboard}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <img
            src={agency.logo}
            alt="Logo"
            className="h-16 w-16 rounded-full object-cover border-2 border-gray-200 shadow-sm"
          />{" "}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back,{" "}
              <span className="font-semibold text-blue-600">
                {agency?.name}
              </span>
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                onClick={() => navigate("/agency/trips/create")}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Trip
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/agency/deals/create")}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Deal
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/agency/highlights/create")}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Highlight
              </Button>
            </div>

            <Button className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
            <Button
              onClick={() => {
                localStorage.removeItem("authToken");
                navigate("/login");
              }}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>
        </header>

        {/* Stats */}
        <DashboardStats trips={trips} deals={deals} highlights={highlights} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Trips & Deals */}
          <div className="lg:col-span-2 space-y-8">
            {/* Trips Section */}
            <TripsCard trips={trips} onDelete={handleDeleteClick} />
            {/* Deals Section */}
            <DealsCard deals={deals} onDelete={handleDeleteClick} />
          </div>

          {/* Right Column - Agency Info & Highlights */}
          <div className="space-y-8">
            {/* Agency Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Agency Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {agency ? (
                  <>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-semibold text-lg">{agency.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Contact</p>
                      <div className="space-y-1">
                        <p className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <a
                            href={`mailto:${agency.email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {agency.email}
                          </a>
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {agency.phone}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Website</p>
                      <a
                        href={agency.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate block"
                      >
                        {agency.website}
                      </a>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Description</p>
                      <p className="text-gray-700">{agency.description}</p>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </>
                ) : (
                  <p className="text-gray-500">
                    No agency information available
                  </p>
                )}
              </CardContent>
            </Card>
            <HighlightsCard
              highlights={highlights}
              onDelete={handleDeleteClick}
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog.title}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
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
