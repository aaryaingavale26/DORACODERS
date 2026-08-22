/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          pink: '#d81b60',
          darkPink: '#c2185b',
        },
        warm: {
          50: '#fdfbf9',
          100: '#faf7f5',
          200: '#f3ece6',
          300: '#e5d9ce',
          800: '#3d3028',
          900: '#231b15',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.04)',
        'elevated': '0 10px 30px -5px rgba(216, 27, 96, 0.15)',
      }
    },
  },
  plugins: [],
}
