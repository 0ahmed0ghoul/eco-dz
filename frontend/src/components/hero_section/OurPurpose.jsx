import { useState, useEffect } from "react";

export default function OurPurpose() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section id="campaign" className="py-20 px-4 md:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Title with animation */}
        <div 
          className={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Help Shape the Future of{" "}
            <span className="text-emerald-600 relative inline-block">
              EcoDZ
              <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12">
                <path
                  d="M0 8 Q50 2, 100 8 T200 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-emerald-400"
                />
              </svg>
            </span>{" "}
            🌱
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left side - Campaign text */}
          <div 
            className={`lg:w-1/2 transform transition-all duration-1000 ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
            }`}
            style={{transitionDelay: '200ms'}}
          >
            <div className="space-y-8">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                We're building EcoDZ{" "}
                <span className="text-emerald-600">with you</span>, not without you
              </h3>

              <div className="space-y-5 text-lg text-gray-600 leading-relaxed">
                <p className="hover:text-gray-900 transition-colors duration-300">
                  EcoDZ is an Algerian eco-tourism web app designed to promote
                  sustainable travel, support local communities, and protect
                  Algeria's natural heritage.
                </p>

                <p className="hover:text-gray-900 transition-colors duration-300">
                  To grow EcoDZ, make it more useful, more profitable, and more
                  recognizable, we want to hear directly from people like you.
                </p>

                <p className="hover:text-gray-900 transition-colors duration-300">
                  Your answers will help us understand what features matter,
                  what services people would pay for, and how EcoDZ can create
                  real impact.
                </p>
              </div>

              {/* Enhanced CTA Button */}
              <div className="pt-4">
                <a href="/campaign/questions">
                  <button className="group relative inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 hover:-translate-y-1">
                    <span className="relative z-10">Answer a few questions</span>
                    <svg
                      className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform duration-300"
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
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>
                </a>
              </div>
            </div>
          </div>

          {/* Right side - Why participate with staggered animations */}
          <div 
            className={`lg:w-1/2 transform transition-all duration-1000 ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`}
            style={{transitionDelay: '400ms'}}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Real Impact",
                  description: "Your feedback directly influences features and decisions",
                  delay: 600
                },
                {
                  title: "Better Services",
                  description: "Help us build services people actually want to pay for",
                  delay: 700
                },
                {
                  title: "Support Locals",
                  description: "Strengthen opportunities for local guides and communities",
                  delay: 800
                },
                {
                  title: "Early Voice",
                  description: "Be part of EcoDZ from its early growth stage",
                  delay: 900
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className={`group bg-white p-7 rounded-2xl border-2 border-gray-100 hover:border-emerald-500 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-100 hover:-translate-y-2 transform ${
                    isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                  }`}
                  style={{transitionDelay: `${item.delay}ms`}}
                >
                  <div className="mb-3 inline-block">
                    <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors duration-300">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 group-hover:scale-110 transition-transform duration-300"></div>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors duration-300">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom decorative border */}
        <div className="mt-16 pt-12 border-t-2 border-gray-100"></div>
      </div>
    </section>
  );
}