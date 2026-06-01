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
          gold: {
            light: '#E7D7C1',
            DEFAULT: '#C4A478',
            dark: '#A5855A',
          },
          copper: {
            light: '#E5A982',
            DEFAULT: '#D37F4B',
            dark: '#B25D2B',
          },
          charcoal: '#1C1A17',
          cream: '#FAF9F6',
        }
      },
      fontFamily: {
        sans: ['Outfit', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
