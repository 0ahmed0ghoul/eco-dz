import { useState, useEffect } from "react";

const AgencyDashboard = () => {
  const [agency, setAgency] = useState(null);
  const [trips, setTrips] = useState([]);
  const token = localStorage.getItem("authToken"); // JWT from login

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/agency/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAgency(data.agency);
        setTrips(data.trips);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  if (!agency) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Agency Dashboard</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Agency Info</h2>
        <p>Name: {agency.name}</p>
        <p>Email: {agency.email}</p>
        <p>Phone: {agency.phone}</p>
        <p>Website: {agency.website}</p>
        <p>Address: {agency.address}</p>
        <p>Description: {agency.description}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Trips</h2>
        {trips.length === 0 ? (
          <p>No trips yet</p>
        ) : (
          <ul className="space-y-2">
            {trips.map((trip) => (
              <li key={trip.id} className="border p-2 rounded">
                <p className="font-bold">{trip.title}</p>
                <p>{trip.description}</p>
                <p>
                  Dates: {trip.start_date} - {trip.end_date}
                </p>
                <p>Status: {trip.approved === 1 ? "Approved" : trip.approved === -1 ? "Rejected" : "Pending"}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AgencyDashboard;
