/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pj: {
          maroon: "#7A1C30",
          maroonDark: "#5B1222",
          maroonLight: "#9B2C44",
          gold: "#D4AF37",
          goldLight: "#F3E5AB",
          goldDark: "#AA820A",
          cream: "#FAF7F2",
          creamLight: "#FFFDF9",
          creamDark: "#F2EBE1",
          charcoal: "#2D2424",
          rose: "#F9EBEA"
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif']
      },
      boxShadow: {
        premium: '0 10px 30px -5px rgba(122, 28, 48, 0.08), 0 4px 12px rgba(0, 0, 0, 0.03)',
        card: '0 4px 20px rgba(122, 28, 48, 0.05)',
        gold: '0 4px 20px rgba(212, 175, 55, 0.25)'
      }
    },
  },
  plugins: [],
}
