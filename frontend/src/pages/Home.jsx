import { useState } from "react";
import Navbar from "../components/navbar_footer/Navbar.jsx";
import Footer from "../components/navbar_footer/Footer.jsx";
import Logo from "./Logo.jsx";
import "../styles/Logo.css";
import Hero from "./Hero.jsx";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const [showLogo, setShowLogo] = useState(true);

  return (
    <div className="site-wrapper relative min-h-screen bg-white">
      {/* Always render the main content structure */}
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <AnimatePresence>
            {!showLogo && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="w-full"
              >
                <Hero />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        <Footer />
      </div>

      {/* Logo overlay */}
      <AnimatePresence>
        {showLogo && (
          <motion.div
            className="logo-container fixed inset-0 z-50 flex items-center justify-center bg-white"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              y: -50,
              transition: { 
                duration: 0.8, 
                ease: "easeInOut" 
              } 
            }}
          >
            <Logo 
              onComplete={() => {
                setTimeout(() => {
                  setShowLogo(false);
                }, 300);
              }} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}