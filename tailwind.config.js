/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ganesh: {
          red: '#DC2626',
          darkred: '#991B1B',
          deepred: '#7F1D1D',
          rose: '#FFF1F2',
          gold: '#D97706',
          white: '#FFFFFF'
        }
      }
    },
  },
  plugins: [],
}
