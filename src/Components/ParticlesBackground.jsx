import React, { useEffect } from "react";

const ParticlesBackground = ({ theme }) => {
  useEffect(() => {
    if (window.particlesJS) {
      // Destroy existing particles instance if it exists
      if (window.pJSDom && window.pJSDom.length > 0) {
        window.pJSDom[0].pJS.fn.vendors.destroypJS();
        window.pJSDom = [];
      }

      // Initialize particles with theme-based color
      window.particlesJS("particles-js", {
        particles: {
          number: { value: 300, density: { enable: true, value_area: 800 } },
          color: { value: theme === "dark" ? "#ffffff" : "#000000" },
          shape: { type: "star" },
          opacity: { value: 0.6, random: true },
          size: { value: 3, random: true },
          line_linked: { enable: false },
          move: { enable: true, speed: 1, direction: "none", out_mode: "out" },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" },
            resize: true,
          },
        },
        retina_detect: true,
      });
    }
  }, [theme]); // Re-run when theme changes

  return (
    <div
      id="particles-js"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100%",
        height: "100vh",
      }}
    />
  );
};

export default ParticlesBackground;
