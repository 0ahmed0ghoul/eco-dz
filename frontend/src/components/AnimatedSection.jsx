// components/AnimatedSection.jsx
import { motion } from "framer-motion";

const variantsMap = {
  1: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  },
  2: {
    hidden: { opacity: 0, x: -80 },
    visible: { opacity: 1, x: 0 },
  },
  3: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
  4: {
    hidden: { opacity: 0, rotateX: 25, y: 40 },
    visible: { opacity: 1, rotateX: 0, y: 0 },
  },
};

const AnimatedSection = ({
  children,
  variant = 1,
  delay = 0,
}) => {
  const selected = variantsMap[variant] || variantsMap[1];

  return (
    <motion.section
      variants={selected}
      initial="hidden"
      whileInView="visible"
      transition={{
        duration: 0.7,
        ease: "easeOut",
        delay,
      }}
      viewport={{ once: true, margin: "-120px" }}
      style={{ transformPerspective: 1000 }} // 🔥 for 3D
    >
      {children}
    </motion.section>
  );
};

export default AnimatedSection;
