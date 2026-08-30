/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF204E',
        secondary: '#1A2238',
        dark: '#0A0F1D',
        light: '#F5F6FA',
      }
    },
  },
  plugins: [],
}
