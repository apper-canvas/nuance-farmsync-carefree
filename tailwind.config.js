/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4f1',
          100: '#d9e6dc',
          200: '#b8d1be',
          300: '#93b89d',
          400: '#6fa17d',
          500: '#2D5016',
          600: '#264713',
          700: '#1f3c10',
          800: '#18300d',
          900: '#0f220a',
        },
        secondary: {
          50: '#f5f9f2',
          100: '#e8f2e0',
          200: '#d2e4c3',
          300: '#b8d2a0',
          400: '#9cc17a',
          500: '#7CB342',
          600: '#6ea038',
          700: '#5c8a2e',
          800: '#4b7326',
          900: '#3a5c1e',
        },
        accent: {
          50: '#fff9f2',
          100: '#ffe8d4',
          200: '#ffd0a8',
          300: '#ffb577',
          400: '#ff9a4a',
          500: '#FFA726',
          600: '#e6961f',
          700: '#cc8519',
          800: '#b37313',
          900: '#99620d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}