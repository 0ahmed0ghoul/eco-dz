const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-green-800 to-emerald-700 text-white pt-12 pb-6 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        {/* EcoDz Info */}
        <div className="md:col-span-2">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.29c-.01-.02-.02-.03-.03-.05C8.67 16.11 10.5 13 17 8z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold">EcoDz</h2>
          </div>
          <p className="text-green-100 mb-4">
            Your gateway to sustainable travel in Algeria. Discover nature, culture, and community through eco-friendly experiences.
          </p>
          <div className="space-y-2 text-green-200">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+213 770 123 456</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>contact@ecodz.dz</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Algiers, Algeria</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-base font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-green-100">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/about" className="hover:text-white">About</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
            <li><a href="/destinations" className="hover:text-white">Destinations</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-base font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-green-100">
            <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
            <li><a href="/help" className="hover:text-white">Help Center</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-green-600 pt-4 text-center text-green-300 text-xs">
        &copy; {new Date().getFullYear()} EcoDz — All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;