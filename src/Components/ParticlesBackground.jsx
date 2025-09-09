import React, { useEffect } from "react";// Importing React and useEffect hook
import "./ParticlesBackground.css"; // Import the CSS file

// Component to render animated particles background
// Props:
// - theme: decides whether particles are white (dark mode) or black (light mode)

const ParticlesBackground = ({ theme }) => {
  useEffect(() => {
    if (window.particlesJS) {
      // ✅ Destroy existing particles instance if it exists
      if (window.pJSDom && window.pJSDom.length > 0) {
        window.pJSDom[0].pJS.fn.vendors.destroypJS();
        window.pJSDom = [];
      }

      // ✅ Initialize particles.js with theme-based configuration
      window.particlesJS("particles-js", {
        particles: {
          number: { value: 300, density: { enable: true, value_area: 800 } }, // Number of particles
          color: { value: theme === "dark" ? "#ffffff" : "#000000" }, // White in dark mode, black in light mode
          shape: { type: "circle" }, // Particle shape
          opacity: { value: 0.6, random: true }, // Transparency with randomness
          size: { value: 2, random: true }, // Small particles, random size
          line_linked: { enable: false }, // Disable connecting lines
          move: {
            enable: true,
            speed: 1, // Slow movement
            direction: "none",
            out_mode: "out", // Particles disappear out of canvas
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: "repulse" }, // Particles move away on hover
            onclick: { enable: true, mode: "push" }, // Add more particles on click
            resize: true, // Adjust on window resize
          },
        },
        retina_detect: true, // Better quality on high-DPI screens
      });
    }
  }, [theme]); // 🔁 Re-run effect when theme changes

  // ✅ Render container for particles.js canvas
  return (
    <div
      id="particles-js"
      style={{
        position: "fixed", // Stays fixed as background
        top: 0,
        left: 0,
        zIndex: -1, // Behind everything
        width: "100%",
        height: "100vh", // Full viewport height
      }}
    />
  );
};

// Export component
export default ParticlesBackground;
