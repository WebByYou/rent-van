/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          400: "#E6C25E",
          500: "#D4AF37",
          600: "#B59428",
        },
        dark: {
          800: "#1A1A1A",
          900: "#0F172A",
        },
      },
      fontFamily: {
        sans: ["Kanit", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
