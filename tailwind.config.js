/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Fuente limpia para facilitar lectura
      },
      colors: {
        // Paleta "Sensory Friendly" (Colores pastel/mate)
        'sensory-bg': '#f8fafc', // Slate 50
        'sensory-text': '#334155', // Slate 700 (Alto contraste pero no negro puro)
        'energy': {
          100: '#dcfce7', // Green 100
          500: '#22c55e', // Green 500
          900: '#14532d', // Green 900
        },
        'anxiety': {
          100: '#fee2e2', // Red 100
          500: '#ef4444', // Red 500
        },
        'masking': {
          low: '#e0f2fe', // Sky 100
          high: '#7dd3fc', // Sky 300
        }
      }
    },
  },
  plugins: [],
}