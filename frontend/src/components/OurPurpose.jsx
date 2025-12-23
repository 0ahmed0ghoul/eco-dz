export default function WhatSetsUsApart() {
    return (
      <section className="py-16 px-4 md:px-8 z-10 ">
        <div className="max-w-6xl mx-auto border-b pb-12 border-gray-200">
          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            What sets us apart
          </h2>
  
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left side - Text content */}
            <div className="lg:w-1/2">
              <div className="space-y-6">
                <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">
                  We're all about sharing the joy of travel
                </h3>
                
                <div className="space-y-4">
                  <p className="text-lg text-white">
                    For over 35 years, we've led travellers around the world to share in the real, rare and remarkable. 
                    We're beyond grateful for what travel gives us – and we're all for giving back through The Intrepid 
                    Foundation by supporting communities worldwide, and we're proud to be B Corp certified since 2018.
                  </p>
                </div>
  
                {/* CTA Button */}
                <div>
                  <button className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-300 group">
                    <span>Read about our purpose</span>
                    <svg 
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M17 8l4 4m0 0l-4 4m4-4H3" 
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
  
            {/* Right side - Stats grid */}
            <div className="lg:w-1/2 ">
              <div className="grid grid-cols-2 gap-6">
                {/* B Corp Certified */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">B Corp Certified</h4>
                  <p className="text-gray-600">Since 2018 - Committed to highest social and environmental standards</p>
                </div>
  
                {/* The Intrepid Foundation */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">The Intrepid Foundation</h4>
                  <p className="text-gray-600">Supporting communities worldwide through sustainable initiatives</p>
                </div>
  
                {/* 35+ Years Experience */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">35+ Years Experience</h4>
                  <p className="text-gray-600">Decades of expertise in creating authentic travel experiences</p>
                </div>
  
                {/* Global Community */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Global Community</h4>
                  <p className="text-gray-600">Connecting travelers with local cultures and communities</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    );
  }