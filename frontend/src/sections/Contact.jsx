import React, { useEffect, useRef } from "react";
import "../styles/contact.css";

function Contact() {
  const overlayRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      const overlay = overlayRef.current;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const start = windowHeight;
      const middle = windowHeight / 2;

      if (rect.top < windowHeight && rect.bottom > 0) {
        let progress = (start - rect.top) / (start - middle);
        progress = Math.max(0, Math.min(progress, 1));

        overlay.style.opacity = 1 - progress;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="contact-section">
      {/* Overlay image */}
      <div className="contact-overlay" ref={overlayRef}></div>

      {/* Content */}
      <h1>Contact</h1>
    </section>
  );
}

export default Contact;
