import React from "react";
import Intro from "../components/Intro";
import GalleryImages from "../components/GalleryImages.jsx";
import Experiences from "../components/Experiences.jsx";
import OurPurpose from "../components/OurPurpose.jsx";
import VideoPart from "../components/VideoPart.jsx";
import Map from "../components/Map.jsx";
import backgroundImage from "../assets/background/2.jpg";

const Hero = () => {
  return (
    <section
      className=" hero relative flex flex-col justify-center min-h-screen px-5 overflow-hidden
        bg-linear-to-br from-blue-100/10 via-emerald-100/10 to-teal-100/10
        bg-center bg-no-repeat bg-cover bg-fixed"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Intro />
      <GalleryImages />
      <Experiences />
      <OurPurpose />
      <VideoPart />
      <Map />
    </section>
  );
};

export default Hero;
