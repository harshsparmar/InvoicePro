/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "Segoe UI", "sans-serif"],
        display: ["Sora", "Manrope", "sans-serif"]
      },
      boxShadow: {
        soft: "0 24px 80px -36px rgba(15, 23, 42, 0.35)"
      }
    }
  },
  plugins: []
};

