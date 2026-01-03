import { useEffect, useState} from "react";
import { useParams,Link } from "react-router-dom";

export default function DealDetails() {
  const { id } = useParams();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeal = async () => {
      const res = await fetch(`http://localhost:5000/api/deals/${id}`);
      const data = await res.json();
      setDeal(data);
      setLoading(false);
    };

    fetchDeal();
  }, [id]);

  if (loading) return <p className="p-8">Loading...</p>;
  if (!deal) return <p className="p-8">Deal not found</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
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
            <Link
              to={`/deals`}
              className="hover:text-gray-700 capitalize"
            >
              deals
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-700 font-medium">{deal.title}</li>
        </ol>
      </nav>
      <img
        src={`/assets/deals/${deal.image}`}
        className="w-full h-72 object-cover rounded-xl mb-6"
      />

      <span className="text-sm font-semibold text-green-600">
        {deal.category}
      </span>

      <h1 className="text-3xl font-bold mt-2">{deal.title}</h1>

      <p className="text-gray-600 mt-4">{deal.description}</p>

      <div className="mt-6 text-lg">
        <p>💰 Discounted Price: {deal.discounted_price} DZD</p>
        <p className="line-through text-gray-400">
          Original: {deal.original_price} DZD
        </p>
      </div>
    </div>
  );
}
