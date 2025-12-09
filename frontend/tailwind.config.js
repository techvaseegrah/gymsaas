/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Updated for Dark Theme
        'primary': '#0f172a',   // Slate-900 (Deep Dark Background) - formerly #1a202c
        'secondary': '#1e293b', // Slate-800 (Card/Section Background) - formerly #2d3748
        'accent': '#3b82f6',    // Blue-500 (Kept same for brand consistency)
        'neutral': '#f7fafc',   // Slate-50 (Kept for light text/accents)
        'base-100': '#ffffff',  // White
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}