import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Tag, 
  Trash2, 
  Edit, 
  Users,
  Clock,
  Eye,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Percent,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const getApprovalStatus = (status) => {
  const config = {
    1: { 
      label: "Approved", 
      icon: TrendingUp, 
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      bgColor: "bg-emerald-50"
    },
    0: { 
      label: "Pending", 
      icon: Clock, 
      color: "bg-amber-100 text-amber-700 border-amber-200",
      bgColor: "bg-amber-50"
    },
    [-1]: { 
      label: "Rejected", 
      icon: AlertCircle, 
      color: "bg-red-100 text-red-700 border-red-200",
      bgColor: "bg-red-50"
    },
  };
  return config[status] || { 
    label: "Unknown", 
    icon: AlertCircle, 
    color: "bg-gray-100 text-gray-700 border-gray-200",
    bgColor: "bg-gray-50"
  };
};

export default function TripsCard({ trips, onDelete }) {
  const navigate = useNavigate();
  const [expandedTrip, setExpandedTrip] = useState(null);

  const toggleExpand = (tripId) => {
    setExpandedTrip(expandedTrip === tripId ? null : tripId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric",
      year: "numeric" 
    });
  };

  const getDaysUntilStart = (startDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const diffTime = start - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTripStats = () => {
    const approved = trips.filter(t => t.approved === 1).length;
    const pending = trips.filter(t => t.approved === 0).length;
    const rejected = trips.filter(t => t.approved === -1).length;
    const totalRevenue = trips.reduce((sum, trip) => sum + (trip.price || 0), 0);
    const bookedTrips = trips.filter(t => t.bookings_count > 0).length;
    
    return { approved, pending, rejected, totalRevenue, bookedTrips };
  };

  const stats = getTripStats();

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="border-b border-emerald-100 bg-linear-to-r from-emerald-50 to-white pb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <MapPin className="h-5 w-5 text-emerald-600" />
              </div>
              Trip Portfolio
            </CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              Manage and track your adventure offerings
            </CardDescription>
          </div>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap gap-3">
            <div className="px-3 py-2 bg-white border border-emerald-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">{stats.approved} Approved</span>
              </div>
            </div>
            <div className="px-3 py-2 bg-white border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">{stats.pending} Pending</span>
              </div>
            </div>
            <div className="px-3 py-2 bg-white border border-emerald-200 rounded-lg">
              <span className="text-sm font-medium text-emerald-700">
                $0
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {trips.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {trips.map((trip) => {
              const status = getApprovalStatus(trip.approved);
              const StatusIcon = status.icon;
              const daysUntilStart = getDaysUntilStart(trip.start_date);
              const isUpcoming = daysUntilStart > 0;
              const images = Array.isArray(trip.image)
                ? trip.image.map((img) =>
                    img.startsWith("http")
                      ? img
                      : `http://localhost:5000${img}`
                  )
                : [];
              
              return (
                <motion.div
                  key={trip.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`rounded-xl border transition-all duration-300 hover:shadow-md overflow-hidden ${status.bgColor}`}
                >
                  <div className="flex flex-col">
                    {/* Image Section */}
                    {images.length > 0 && (
                      <div className="relative h-40 overflow-hidden">
                        <motion.img
                          initial={{ scale: 1 }}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                          src={images[0]}
                          alt={trip.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className={`px-3 py-1 ${status.color} font-medium`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>
                        {daysUntilStart > 0 && (
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm border border-emerald-200 rounded-lg px-2 py-1 text-xs font-medium text-emerald-700">
                            In {daysUntilStart} days
                          </div>
                        )}
                        <div className="absolute bottom-3 left-3">
                          <span className="text-xs font-semibold bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded border border-white/50">
                            {trip.category || "Adventure"}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Content Section */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-gray-900 truncate">
                            {trip.title}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                            {trip.description || "No description provided"}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/trips/${trip.id}`)}
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete("trips", trip.id, trip.title)}
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Compact Trip Details */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-2">
                          <div className="flex items-center gap-1.5 text-gray-600 text-xs mb-1">
                            <Tag className="h-3 w-3" />
                            <span>Price</span>
                          </div>
                          <div className="text-sm font-bold text-emerald-700">
                            ${trip.price?.toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-2">
                          <div className="flex items-center gap-1.5 text-gray-600 text-xs mb-1">
                            <Clock className="h-3 w-3" />
                            <span>Duration</span>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {trip.duration} days
                          </div>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-2">
                          <div className="flex items-center gap-1.5 text-gray-600 text-xs mb-1">
                            <Calendar className="h-3 w-3" />
                            <span>Start</span>
                          </div>
                          <div className="text-xs font-medium text-gray-900 truncate">
                            {formatDate(trip.start_date)}
                          </div>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-2">
                          <div className="flex items-center gap-1.5 text-gray-600 text-xs mb-1">
                            <Users className="h-3 w-3" />
                            <span>Capacity</span>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {trip.max_people || '∞'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Expanded Details with Animation */}
                      <AnimatePresence>
                        {expandedTrip === trip.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ 
                              opacity: 1, 
                              height: "auto",
                              transition: { 
                                opacity: { duration: 0.3 },
                                height: { duration: 0.3, ease: "easeInOut" }
                              }
                            }}
                            exit={{ 
                              opacity: 0, 
                              height: 0,
                              transition: { 
                                opacity: { duration: 0.2 },
                                height: { duration: 0.2, ease: "easeInOut" }
                              }
                            }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 border-t border-gray-200">
                              <div className="grid grid-cols-2 gap-3">
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 }}
                                  className="bg-white border border-gray-200 rounded-lg p-3"
                                >
                                  <h4 className="text-xs font-semibold text-gray-700 mb-1">Category</h4>
                                  <Badge variant="outline" className="border-emerald-200 text-emerald-700 capitalize text-xs">
                                    {trip.category}
                                  </Badge>
                                </motion.div>
                                
                                <motion.div
                                  initial={{ opacity: 0, x: 10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.15 }}
                                  className="bg-white border border-gray-200 rounded-lg p-3"
                                >
                                  <h4 className="text-xs font-semibold text-gray-700 mb-1">Created On</h4>
                                  <p className="text-sm text-gray-900">{formatDate(trip.created_at)}</p>
                                </motion.div>
                                
                                {trip.difficulty && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white border border-gray-200 rounded-lg p-3 col-span-2"
                                  >
                                    <h4 className="text-xs font-semibold text-gray-700 mb-1">Difficulty</h4>
                                    <Badge variant="outline" className="border-gray-200 text-gray-700 capitalize text-xs">
                                      {trip.difficulty}
                                    </Badge>
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Actions */}
                      <div className="flex items-center justify-between gap-2 mt-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(trip.id)}
                          className="text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs"
                        >
                          <motion.div
                            animate={{ rotate: expandedTrip === trip.id ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronRight className="h-3 w-3 mr-1" />
                          </motion.div>
                          {expandedTrip === trip.id ? 'Show Less' : 'Show More'}
                        </Button>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/agency/trips/edit/${trip.id}`)}
                            disabled={trip.approved !== 1}
                            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs px-2"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <EmptyTripState />
        )}
      </CardContent>
    </Card>
  );
}

function EmptyTripState() {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 px-4"
    >
      <div className="max-w-sm mx-auto">
        <div className="w-16 h-16 mx-auto mb-6 bg-emerald-100 rounded-2xl flex items-center justify-center">
          <MapPin className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          No trips created yet
        </h3>
        <p className="text-gray-600 mb-6 text-sm">
          Start your journey by creating your first eco-friendly adventure
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            onClick={() => navigate("/agency/trips/create")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Edit className="h-4 w-4 mr-2" />
            Create Your First Trip
          </Button>
        </div>
      </div>
    </motion.div>
  );
}