/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E50914',
        secondary: '#222222',
        dark: '#141414',
        light: '#F5F5F5',
      }
    },
  },
  plugins: [],
}
