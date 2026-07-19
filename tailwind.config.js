/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#ebf0ff',
          200: '#d6e0ff',
          300: '#adc2ff',
          400: '#7594ff',
          500: '#3b5cfa',
          600: '#253df5',
          700: '#1d2ae0',
          800: '#1a22b8',
          900: '#1a2191',
        }
      }
    },
  },
  plugins: [],
}
