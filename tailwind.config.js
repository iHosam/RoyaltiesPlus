/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saudi: {
          green: "#006C35",
          gold: "#D4AF37",
          darkGreen: "#004722",
          lightGreen: "#E8F5E9",
          accent: "#028844"
        }
      },
      fontFamily: {
        sans: ['IBM Plex Sans Arabic', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
