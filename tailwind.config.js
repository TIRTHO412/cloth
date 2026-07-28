/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F7F7F5",
        "luxury-black": "#111111",
        "luxury-gray": "#666666",
        "luxury-lightgray": "#888888",
        "luxury-accent": "#EAEAEA",
        "luxury-border": "#E2E2DF",
        "luxury-card": "#FFFFFF",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        editorial: ["Cormorant Garamond", "serif"],
        heading: ["Syne", "Inter", "sans-serif"],
      },
      letterSpacing: {
        ultra: "0.25em",
        mega: "0.4em",
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
