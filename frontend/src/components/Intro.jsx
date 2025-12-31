import React, { useState } from 'react';
import logo from '/assets/images/main-logo.png';
import MainSearchBar from "./MainSearchBar.jsx";

function Intro() {
  return (
    <section
      id="intro"
      aria-label="Introduction to EcoDz"
    >
        <div className="absolute inset-0 bg-black/50"></div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[60vh] sm:min-h-[50vh] px-4 pt-16 md:pt-0 mt-5 sm:mt-0">
      <div className="relative mt-10 max-w-4xl mx-auto">
          {/* Logo */}
          <div className="absolute -top-24 sm:-top-24 md:-top-15 left-1/2 -translate-x-1/2 z-20">
          <img
              src={logo}
              alt="EcoDz - Sustainable Travel in Algeria"
              className="w-32 h-32 object-contain rounded-full shadow-2xl border-4 border-white/20"
              loading="lazy"
            />
          </div>
          {/* Text Content */}
          <div className="bg-gradient-to-b from-white/10 to-transparent backdrop-blur-sm rounded-3xl p-8 sm:p-12 border border-white/20 shadow-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-emerald-100 to-cyan-100 bg-clip-text text-transparent">
              Welcome to <span className="text-yellow-400 drop-shadow-lg">EcoDz</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-10 leading-relaxed px-4">
              Your gateway to eco-friendly travel experiences in Algeria.<br className="hidden sm:block" />
              Discover sustainable adventures that respect our planet.
            </p>
            <MainSearchBar />
          </div>
        </div>
      </div>
     
    </section>
  );
}

export default Intro;