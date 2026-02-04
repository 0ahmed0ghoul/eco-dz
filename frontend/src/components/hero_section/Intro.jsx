import { useRef, useState } from "react";
import logo from "/assets/images/main-logo.png";
import MainSearchBar from "../navbar_footer/MainSearchBar.jsx";

function Intro() {
  const audioRef = useRef(null);
  const [showHint, setShowHint] = useState(true);

  const handlePlay = () => {
    audioRef.current?.play();
    setShowHint(false);
  };

  return (
    <section id="intro" aria-label="Introduction to EcoDz">
      <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[60vh] sm:min-h-[65vh] md:min-h-[70vh] px-4 pt-12 sm:pt-12 md:pt-8">

        {/* ---------- HERO ---------- */}
        <div className="relative my-6 sm:my-8 md:my-10 max-w-4xl mx-auto w-full">

          {/* ---------- LOGO ---------- */}
          <div className="absolute -top-16 sm:-top-12 left-1/2 -translate-x-1/2 z-20 group">

            {/* Tooltip */}
            {showHint && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1 rounded-full animate-pulse whitespace-nowrap">
                Click on Maqam Eshahid logo
              </div>
            )}

            {/* Logo Container */}
            <div
              onClick={handlePlay}
              className="relative cursor-pointer"
            >
              <img
                src={logo}
                alt="EcoDz"
                className="
                  w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32
                  object-contain rounded-full
                  border-4 border-white/30 shadow-2xl
                  transition-all duration-500 ease-out
                  group-hover:scale-110
                  group-hover:rotate-3
                "
              />

              {/* Glow */}
              <div
                className="
                  absolute inset-0 rounded-full
                  bg-emerald-400/30 blur-xl
                  opacity-0 group-hover:opacity-100
                  transition duration-500 -z-10
                "
              />

              {/* Ripple */}
              <span
                className="
                  absolute inset-0 rounded-full
                  bg-emerald-400/20
                  animate-ping opacity-0
                  group-hover:opacity-100
                "
              />
            </div>
          </div>

          {/* ---------- CONTENT CARD ---------- */}
          <div className="bg-linear-to-b from-white/10 to-transparent backdrop-blur-sm rounded-xl sm:rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 border border-white/20 shadow-lg sm:shadow-xl md:shadow-2xl mt-16 sm:mt-20 md:mt-24">

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-linear-to-r from-gray-500 via-emerald-400 to-cyan-100 bg-clip-text text-transparent leading-tight">
              Welcome to{" "}
              <span className="text-yellow-400 block sm:inline">
                EcoDz
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700/90 mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto">
              Your gateway to eco-friendly travel experiences in Algeria.
            </p>

            {/* Search Bar */}
            <div className="w-full max-w-2xl mx-auto">
              <MainSearchBar />
            </div>

            {/* Decorative Tags */}
            <div className="mt-8 sm:mt-10 flex justify-center items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Eco-friendly
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Local guides
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Sustainable tourism
              </span>
            </div>
          </div>
        </div>

        {/* ---------- AUDIO ---------- */}
        <audio ref={audioRef} preload="auto">
          <source src="/audio/audio.mp3" type="audio/mpeg" />
        </audio>

        {/* ---------- SCROLL INDICATOR ---------- */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 hidden sm:block">
          <div className="animate-bounce">
            <svg
              className="w-6 h-6 text-emerald-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Intro;
