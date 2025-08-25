/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'text-primary': 'rgb(61, 61, 78)',
        'text-secondary': '#6b7280',
        'bg-primary': '#ffffff',
        'bg-secondary': '#f8f9fa',
        'accent': '#3b82f6',
        'accent-green': '#10b981',
        'primary-900': 'rgb(61, 61, 78)',
      },
      fontFamily: {
        'mona': ['Mona Sans', 'sans-serif'],
        'manrope': ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
