/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        vazir: ["vazir", "sans-serif"],
        vazirBold: ["vazirBold", "sans-serif"],
      },
    },
  },
  plugins: [],
};
