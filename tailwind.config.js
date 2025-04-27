/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fall: {
          "0%": { transform: "translateY(-100px)", opacity: "0" }, // Start just above screen
          "10%": { opacity: "1" }, // Fade in quickly
          "90%": { opacity: "1" }, // Stay visible while falling
          "100%": { transform: "translateY(100vh)", opacity: "0" }, // Fall fully to bottom
        },
      },
      animation: {
        fall: "fall 3s linear forwards", // Add 'forwards' so it stays at end until removed
      },
    },
  },
  plugins: [],
};
