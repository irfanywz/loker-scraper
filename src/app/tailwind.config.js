/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "../core/tools/**/*.{vue,js,ts,jsx,tsx}", 
    "./src/**/*.{vue,js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}