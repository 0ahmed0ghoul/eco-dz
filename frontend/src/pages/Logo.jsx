import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Logo.css";

const Logo = ({ onComplete }) => {
  const [animationStage, setAnimationStage] = useState("entering");
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    // Entry animation
    const entryTimer = setTimeout(() => {
      setAnimationStage("entered");
    }, 1000); // Logo visible duration after entry

    // Start exit after total time
    const exitTimer = setTimeout(() => {
      setAnimationStage("exiting");
      
      // Call onComplete after exit animation duration
      const completeTimer = setTimeout(() => {
        if (!hasCompletedRef.current && onComplete) {
          hasCompletedRef.current = true;
          onComplete();
        }
      }, 800); // Match exit animation duration
      
      return () => clearTimeout(completeTimer);
    }, 2000); // Total animation duration (entry + display)

    return () => {
      clearTimeout(entryTimer);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <div className="logo-container">
      <motion.div
        initial={{ 
          opacity: 0, 
          y: 50,
          scale: 0.8 
        }}
        animate={animationStage === "entering" ? {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.8,
            ease: "easeOut"
          }
        } : animationStage === "exiting" ? {
          opacity: 0,
          y: -100,
          scale: 0.9,
          rotate: -5,
          transition: {
            duration: 0.8,
            ease: "easeIn"
          }
        } : {
          opacity: 1,
          y: 0,
          scale: 1
        }}
        onAnimationComplete={() => {
          // Call onComplete when exit animation completes
          if (animationStage === "exiting" && !hasCompletedRef.current && onComplete) {
            hasCompletedRef.current = true;
            onComplete();
          }
        }}
      >
        <svg
          width="400"
          height="200"
          viewBox="0 0 400 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gradient */}
          <defs>
            <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#01a177" />
            </linearGradient>
          </defs>

          {/* Logo image */}
          <image
            href={"/assets/logos/logo.png"}
            x="150"
            y="70"
            width="100"
            height="100"
          >
            <animate 
              attributeName="opacity" 
              from="0" 
              to="1" 
              dur="0.5s" 
              fill="freeze" 
              begin="0s"
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

          {/* Title text */}
          <text
            x="200"
            y="120"
            fontSize="40"
            fontWeight="900"
            fontFamily="Arial, sans-serif"
            opacity="0"
            dominantBaseline="middle"
            textAnchor="start"
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
      </motion.div>
    </div>
  );
};

export default Logo;