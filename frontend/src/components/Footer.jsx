import { useState } from "react";
import { Check, Globe, ChevronDown } from "lucide-react";

const Footer = () => {
  const [isHelpful, setIsHelpful] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState("Global");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const regions = ["Global", "North America", "Europe", "Australia", "Asia"];

  return (
    <footer className="bg-gray-50 text-gray-700 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top row: helpful + region */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Was this page helpful?
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => setIsHelpful(true)}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  isHelpful === true
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => setIsHelpful(false)}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  isHelpful === false
                    ? "bg-red-100 text-red-700 border border-red-300"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                No
              </button>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Region
            </h3>
            <div className="relative">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full sm:w-48 appearance-none bg-white border border-gray-300 rounded-md pl-8 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Subscribe */}
        <div className="max-w-md">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Subscribe for updates
          </h3>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
          {subscribed && (
            <p className="text-green-600 text-sm mt-2 flex items-center">
              <Check className="h-4 w-4 mr-1" /> Subscribed successfully!
            </p>
          )}
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Booking</h4>
            <ul className="space-y-1">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">My Booking</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Trip feedback</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Travel Alerts</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Company</h4>
            <ul className="space-y-1">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">About us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Careers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Privacy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Contact</h4>
            <ul className="space-y-1">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Get in touch</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">FAQ</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Reviews</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Purpose</h4>
            <ul className="space-y-1">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">B Corp</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Planet</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Wildlife</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-200 pt-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Intrepid Travel. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Certified B Corporation • Climate Action Leader</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
