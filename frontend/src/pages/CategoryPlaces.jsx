import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { generateSlug } from "../utils/generateSlug";
export default function CategoryPlaces() {
  const { category } = useParams();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // =======================
  // FETCH PLACES BY CATEGORY
  // =======================
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/places/${category}`);
        const data = await res.json();
        setPlaces(data);
      } catch (error) {
        console.error("Failed to fetch places", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, [category]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading places...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-16">
      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-gray-500">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="hover:text-gray-700">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/places" className="hover:text-gray-700">
              Places
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-700 font-medium">{category}</li>
        </ol>
      </nav>
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <div className="text-center mb-14">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 capitalize">
            Places in {category}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover Algeria's ecological places in the "{category}" category.
          </p>
        </div>

        {/* PLACES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {places.map((place) => (
            <div
              key={place.id}
              className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-64"
            >
              {/* IMAGE */}
              <img
                src={place.image}
                alt={place.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* DARK OVERLAY */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-500" />

              {/* CONTENT */}
              <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
                <div>
                  <MapPin
                    size={28}
                    className="mb-4 opacity-90 drop-shadow-lg"
                  />
                  <h2 className="text-2xl font-bold drop-shadow-lg">
                    {place.name}
                  </h2>
                  <p className="text-white/90 mt-2 text-sm">
                    {place.description}
                  </p>
                  <p className="mt-1 text-yellow-300 font-semibold">
                    Rating: {place.avg_rating || "Not rated yet"}
                  </p>
                </div>
                {/* VIEW PLACE BUTTON */}
                <Link
                  to={`/places/${category}/${place.slug}`}
                  className="mt-4 inline-block text-center bg-white text-gray-900 font-semibold py-2 rounded-xl
               hover:bg-gray-100 transition-all duration-300"
                >
                  View place
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
