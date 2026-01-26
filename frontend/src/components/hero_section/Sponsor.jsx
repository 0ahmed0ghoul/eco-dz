import { useState, useEffect } from "react";

export default function OurPurpose() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      style={{
        backgroundImage: 'url(/public/assets/background/speed.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      id="collab"
      className="py-24 px-4 md:px-8 relative overflow-hidden"
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-emerald-900/50"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-600 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Title with animation */}
        <div 
          className={`text-center mb-20 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="inline-block mb-4 px-4 py-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full">
            <span className="text-emerald-300 text-sm font-semibold tracking-wider uppercase">Special Collaboration</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Explore Algeria With{" "}
            <span className="text-emerald-400 relative inline-block">
              IShowSpeed!
              <svg className="absolute -bottom-3 left-0 w-full" height="16" viewBox="0 0 200 16">
                <path
                  d="M0 10 Q50 4, 100 10 T200 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-emerald-500"
                />
              </svg>
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join us on an incredible journey as we showcase Algeria's hidden gems and natural wonders through the eyes of one of the world's most energetic content creators
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left side - Feature highlights */}
          <div 
            className={`lg:w-1/2 transform transition-all duration-1000 ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
            }`}
            style={{transitionDelay: '200ms'}}
          >
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/30 transition-colors duration-300">
                    <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Exclusive Content</h3>
                    <p className="text-gray-300 leading-relaxed">Experience Algeria's beauty through viral-worthy content that reaches millions worldwide</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/30 transition-colors duration-300">
                    <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Global Reach</h3>
                    <p className="text-gray-300 leading-relaxed">Put Algeria on the map for adventure seekers and eco-tourists from around the globe</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/30 transition-colors duration-300">
                    <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Community Impact</h3>
                    <p className="text-gray-300 leading-relaxed">Support local guides, businesses, and communities through increased tourism awareness</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Impact cards with staggered animations */}
          <div 
            className={`lg:w-1/2 transform transition-all duration-1000 ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`}
            style={{transitionDelay: '400ms'}}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Viral Reach",
                  description: "Millions of views showcasing Algeria's stunning landscapes",
                  icon: "📱",
                  delay: 600
                },
                {
                  title: "Authentic Stories",
                  description: "Real experiences highlighting local culture and traditions",
                  icon: "🎬",
                  delay: 700
                },
                {
                  title: "Tourism Boost",
                  description: "Attract adventure seekers to explore Algeria's hidden treasures",
                  icon: "🌍",
                  delay: 800
                },
                {
                  title: "Youth Engagement",
                  description: "Inspire the next generation to appreciate eco-tourism",
                  icon: "⚡",
                  delay: 900
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className={`group bg-white/10 backdrop-blur-md p-7 rounded-2xl border-2 border-white/20 hover:border-emerald-400/50 hover:bg-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-2 transform ${
                    isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                  }`}
                  style={{transitionDelay: `${item.delay}ms`}}
                >
                  <div className="mb-4 text-4xl group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors duration-300">
                    {item.title}
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div 
          className={`mt-20 text-center transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
          style={{transitionDelay: '1000ms'}}
        >
<a 
  href="https://www.youtube.com/watch?v=thZ9Vt6RQEI" 
  target="_blank" 
  rel="noopener noreferrer"
>
  <button className="group relative inline-flex items-center gap-3 px-10 py-5 bg-emerald-500 text-white font-bold text-lg rounded-2xl overflow-hidden transition-all duration-300 hover:bg-emerald-600 hover:shadow-2xl hover:shadow-emerald-500/50 hover:-translate-y-1">
    <span className="relative z-10">Watch the Journey</span>
    <svg
      className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform duration-300"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
  </button>
</a>

        </div>

        {/* Bottom decorative border */}
        <div className="mt-16 pt-12 border-t-2 border-white/10"></div>
      </div>
    </section>
  );
}