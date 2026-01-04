import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Tag, Trash2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

const getApprovalStatus = (status) => {
  const config = {
    1: { label: "Approved", variant: "success" },
    0: { label: "Pending", variant: "warning" },
    [-1]: { label: "Rejected", variant: "destructive" },
  };
  return config[status] || { label: "Unknown", variant: "secondary" };
};

export default function TripsCard({ trips, onDelete }) {
    const navigate = useNavigate();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Your Trips
        </CardTitle>
        <CardDescription>Manage and track your trip listings</CardDescription>
      </CardHeader>

      <CardContent>
        {trips.length > 0 ? (
          <div className="space-y-4">
            {trips.map((trip) => {
              const status = getApprovalStatus(trip.approved);

              return (
                <div
                  key={trip.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg">{trip.title}</h3>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>

                    <p className="text-gray-600 mb-2 line-clamp-2">
                      {trip.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {trip.start_date} → {trip.end_date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="h-4 w-4" />$
                        {trip.price || "Price on request"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 sm:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/agency/trips/edit/${trip.id}`)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete("trips", trip.id, trip.title)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No trips created yet</p>
        )}
      </CardContent>
    </Card>
  );
}
