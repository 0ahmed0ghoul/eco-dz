import { useState } from 'react';
import { Check, Globe, ChevronDown } from 'lucide-react';

const Footer = () => {
  const [isHelpful, setIsHelpful] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('Global');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const regions = ['Global', 'North America', 'Europe', 'Australia', 'Asia'];

  return (
    <footer className="bg-gray-50 text-gray-700">
      {/* Was this page helpful? section */}
      <div className="border-t border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-1">Was this page helpful?</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsHelpful(true)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isHelpful === true 
                      ? 'bg-green-100 text-green-700 border border-green-300' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setIsHelpful(false)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isHelpful === false 
                      ? 'bg-red-100 text-red-700 border border-red-300' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  No
                </button>
              </div>
            </div>
            
            {/* Region selector */}
            <div className="w-full sm:w-auto">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Change region</h3>
              <div className="relative">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full sm:w-48 appearance-none bg-white border border-gray-300 rounded-md pl-10 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
                <Globe className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Get the goods! Travel deals, new trips, inspiration and more.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscribe section */}
      <div className="border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscribe to emails</h3>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="flex-grow px-4 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
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
        </div>
      </div>

      {/* Main footer links */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
            {/* Booking Column */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Booking</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">My Booking</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Submit trip feedback</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Safe Travels Hub</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Travel Alerts</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Flexible bookings</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Booking conditions</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Agent login</a></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">About us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">The Good Times</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Intrepid DMC</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Privacy policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">You're privacy choices</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Intrepidtravel.com accessibility statement</a></li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Contact</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Get in touch</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Live chat</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">FAQ</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Reviews</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Newsroom</a></li>
              </ul>
            </div>

            {/* Purpose Column */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Purpose</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">B Corp</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">The Intrepid Foundation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">People</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Planet</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Wildlife</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Certified section */}
      <div className="bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 text-sm">
              <p className="font-medium text-gray-900">Certified</p>
              <p className="mt-1">B Corporation and Climate Action Leader</p>
            </div>
            
            {/* Placeholder for certification logos */}
            <div className="flex items-center space-x-4">
              <div className="w-24 h-10 bg-gray-300 rounded flex items-center justify-center text-gray-500 text-sm">
                Logo 1
              </div>
              <div className="w-24 h-10 bg-gray-300 rounded flex items-center justify-center text-gray-500 text-sm">
                Logo 2
              </div>
              <div className="w-24 h-10 bg-gray-300 rounded flex items-center justify-center text-gray-500 text-sm">
                Logo 3
              </div>
            </div>
          </div>
          
          {/* Bottom copyright */}
          <div className="mt-6 pt-4 border-t border-gray-300">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Intrepid Travel. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;