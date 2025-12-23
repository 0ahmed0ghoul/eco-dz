import { useState, useRef } from 'react';

export default function VideoWithFeatures() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const features = [
    {
      title: 'Small group experts',
      description: "We've specialised in real, rare and remarkable small group adventures since 1980.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'text-emerald-600'
    },
    {
      title: 'Locally based leaders',
      description: 'Our passionate leaders are genuinely connected to the places we go and the people we meet.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'text-blue-600'
    },
    {
      title: 'Immersive experiences',
      description: 'Uncover authentic local experiences that connect you to the heart of a place.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      color: 'text-amber-600'
    },
    {
      title: 'Like-minded travellers',
      description: 'Connect and share experiences with a community of spirited explorers who care about the planet.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-purple-600'
    },
  ];

  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto border-b pb-12 border-gray-200">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Old songs with new friends
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left side - Video Container */}
          <div className="lg:w-2/3">
            <div className="relative rounded-xl overflow-hidden bg-gray-100">
              {/* Video element with poster */}
              <video
                ref={videoRef}
                className="w-full h-[500px] object-cover"
                poster="/images/video-poster.jpg" // Replace with your poster image
                controls={isPlaying}
                onClick={isPlaying ? undefined : handlePlayVideo}
              >
                <source src="/videos/travel-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Play button overlay - only shows when not playing */}
              {!isPlaying && (
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                  onClick={handlePlayVideo}
                >
                  <div className="relative group">
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
                    <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                      <svg 
                        className="w-10 h-10 text-emerald-600 ml-1" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Content overlay on video */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="text-white max-w-lg">
                  <h3 className="text-xl md:text-2xl font-bold mb-3">
                    Experience the journey with us
                  </h3>
                  <p className="text-white/90">
                    Watch how our small group adventures create unforgettable memories and lifelong friendships
                  </p>
                </div>
              </div>
            </div>

            {/* Video controls info */}
            <div className="mt-4 text-center">
              <p className="text-sm text-white">
                Click the play button to watch our story • {isPlaying ? 'Now playing' : 'Click to play'}
              </p>
            </div>
          </div>

          {/* Right side - Features grid */}
          <div className="lg:w-1/3">
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="group p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon container */}
                    <div className={`${feature.color} p-3 rounded-lg bg-white border border-gray-200 group-hover:border-emerald-300 transition-colors`}>
                      {feature.icon}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* CTA Button */}
              <div className="pt-6 border-t border-gray-200">
                <button className="w-full py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors duration-300 flex items-center justify-center gap-2">
                  <span>Explore our approach</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}