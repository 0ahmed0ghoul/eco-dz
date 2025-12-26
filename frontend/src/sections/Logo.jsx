import React, { useEffect } from "react";
import "../styles/Logo.css";

const Logo = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="logo-container fade-out">
      <svg
        width="400"
        height="200"
        viewBox="0 0 400 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gradient definition */}
        <defs>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#01a177" />
          </linearGradient>
        </defs>

        {/* Logo image */}
        <image
          href={'/assets/logos/logo.png'}
          x="150"
          y="70"
          width="100"
          height="100"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            dur="0.5s"
            fill="freeze"
          />
          <animate
            attributeName="x"
            from="150"
            to="80"
            begin="0.5s"
            dur="0.5s"
            fill="freeze"
          />
        </image>

        {/* Title text with gradient + accent */}
        <text
          x="200"
          y="120" // vertical midpoint of the logo
          fontSize="40"
          fontWeight="900"
          fontFamily="Arial, sans-serif"
          opacity="0"
          dominantBaseline="middle" // align text vertically to the middle
          textAnchor="start" // align horizontally to the left edge
          fill="url(#textGradient)"
        >
          <tspan fill="#01a177">E</tspan>co
          <tspan fill="#01a177">D</tspan>z
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            begin="0.5s"
            dur="0.5s"
            fill="freeze"
          />
          <animate
            attributeName="x"
            from="300"
            to="200"
            begin="0.5s"
            dur="0.5s"
            fill="freeze"
          />
        </text>
      </svg>
    </div>
  );
};

export default Logo;
