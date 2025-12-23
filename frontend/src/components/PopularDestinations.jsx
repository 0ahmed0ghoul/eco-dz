export default function PopularDestinations() {
    const popularDestinations = [
      'Peru', 'Japan', 'Tanzania', 'Vietnam', 'Rome', 'Egypt', 'Greece'
    ];
  
    const goodTimesArticles = [
      '26 totally new intrepid trips and experiences for 2026',
      '12 new offbeat adventures in lesser-known places',
      '10 new purposeful ways to travel responsibly',
      "Step inside the Sierra Leone village where women rule",
      "Stay with nomadic reindeer herders in Mongolia's remote taiga forest"
    ];
  
    return (
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Column - Popular Destinations */}
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                Popular destinations
              </h2>
              
              <div className="space-y-4">
                {popularDestinations.map((destination, index) => (
                  <a
                    key={index}
                    href="#"
                    className="group flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                  >
                    <span className="text-lg text-gray-700 group-hover:text-gray-900">
                      {destination}
                    </span>
                    <svg 
                      className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transform group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                ))}
              </div>
  
              {/* Divider - Visible only on mobile */}
              <div className="mt-12 pt-8 border-t border-gray-200 lg:hidden">
                <div className="h-1 w-12 bg-emerald-500 rounded-full mb-4" />
              </div>
            </div>
  
            {/* Right Column - Get Inspired */}
            <div className="lg:w-1/2">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Get inspired on The Good Times
                </h2>
                <p className="text-gray-600 mb-6">
                  Discover stories, tips, and insights from our travel community
                </p>
              </div>
  
              <div className="space-y-6">
                {goodTimesArticles.map((article, index) => (
                  <div 
                    key={index}
                    className="group cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      {/* Number badge */}
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                      </div>
  
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                            The Goods
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2">
                          {article}
                        </h3>
                      </div>
  
                      {/* Arrow icon */}
                      <svg 
                        className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 mt-2 flex-shrink-0 transform group-hover:translate-x-1 transition-transform" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
  
                    {/* Divider between items */}
                    {index < goodTimesArticles.length - 1 && (
                      <div className="mt-6 pt-6 border-t border-gray-100" />
                    )}
                  </div>
                ))}
              </div>
  
              {/* View all button */}
              <div className="mt-8">
                <button className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors group">
                  <span>View all articles</span>
                  <svg 
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
  
          {/* Bottom section - Additional content */}
          <div className="mt-16 pt-12 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-block p-4 bg-emerald-100 rounded-2xl mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Expert guides</h4>
                <p className="text-gray-600">Local leaders with deep cultural knowledge</p>
              </div>
  
              <div className="text-center">
                <div className="inline-block p-4 bg-blue-100 rounded-2xl mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Sustainable travel</h4>
                <p className="text-gray-600">Positive impact on communities and environment</p>
              </div>
  
              <div className="text-center">
                <div className="inline-block p-4 bg-amber-100 rounded-2xl mb-4">
                  <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Small groups</h4>
                <p className="text-gray-600">Intimate experiences with like-minded travelers</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }